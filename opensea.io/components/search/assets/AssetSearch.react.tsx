import React from "react"
import AppComponent from "../../../AppComponent.react"
import {
  CHAIN_IDENTIFIERS_TO_NAMES,
  CHAIN_IDENTIFIER_INFORMATION,
} from "../../../constants"
import { AssetSearch_data } from "../../../lib/graphql/__generated__/AssetSearch_data.graphql"
import { AssetSearchQuery } from "../../../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { CollectionSort } from "../../../lib/graphql/__generated__/CollectionFilterQuery.graphql"
import {
  getNodes,
  graphql,
  paginate,
  PaginationProps,
} from "../../../lib/graphql/graphql"
import { flatMap } from "../../../lib/helpers/array"
import Router from "../../../lib/helpers/router"
import { snakeCaseToSentenceCase } from "../../../lib/helpers/stringUtils"
import { MapNonNullable } from "../../../lib/helpers/type"
import QP from "../../../lib/qp/qp"
import AssetSelection from "../../assets/AssetSelection.react"
import CollectionHeadMetadata from "../../collections/CollectionHeadMetadata.react"
import Panel from "../../layout/Panel.react"
import SearchPills from "../SearchPills.react"
import withSearch, { SearchProps } from "../WithSearch.react"
import AssetSearchFilter, {
  POSSIBLE_FILTER_ITEMS,
  SuspendedLazyAssetSearchFilter,
} from "./AssetSearchFilter"
import AssetSearchList, { AssetSearchListAsset } from "./AssetSearchList.react"
import { priceFilterLabel } from "./PriceFilter.react"

export type AssetSearchVariables = MapNonNullable<AssetSearchQuery["variables"]>

export type ChainSelectionBatchAction = "transfer" | "sell"

export type SelectionBatchAction =
  | ChainSelectionBatchAction
  | "changeCollection"
  | "hide"
  | "unhide"

export const PAGE_SIZE = 32

const CLEARED_STATE: AssetSearchVariables = {
  categories: undefined,
  chains: undefined,
  collection: undefined,
  collections: [],
  collectionQuery: undefined,
  identity: undefined,
  includeHiddenCollections: undefined,
  numericTraits: undefined,
  paymentAssets: undefined,
  priceFilter: undefined,
  query: "",
  resultModel: undefined,
  sortAscending: undefined,
  sortBy: undefined,
  stringTraits: undefined,
  toggles: undefined,
  creator: undefined,
}
// const POLLING_INTERVAL_IN_MILLISECONDS = 5000
const SELECTION_MAX_SIZE = 20

interface Props {
  children: (props: {
    Assets: React.ElementType<{ isMultiline?: boolean; className?: string }>
    Filter: React.ElementType<{
      className?: string
      renderFn?: (
        renderContent: (close: () => unknown) => JSX.Element,
      ) => JSX.Element
      variant?: "lazy" | "default"
    }>
    Pills: React.ElementType<{
      style?: React.CSSProperties
      showResultCount?: boolean
    }>
    Metadata: React.ElementType
    Selection: React.ElementType
    clear: () => unknown
    state: AssetSearchVariables
    totalCount?: number
    update: (searchState: Partial<AssetSearchVariables>) => Promise<unknown>
  }) => React.ReactNode
  collectionSortBy?: CollectionSort
  data: AssetSearch_data | null
  onClear?: () => unknown
  path?: string
  collectionPanelMode?: Panel["props"]["mode"]
  showContextMenu?: boolean
  showSellButtons?: boolean
  defaultState?: AssetSearchVariables
  initialState: Partial<AssetSearchVariables>
  fixedState?: Partial<AssetSearchVariables>
  hideAssetCount?: boolean
  includeCollectionFilter?: boolean
  includeCategoryFilter?: boolean
  showSelector?: boolean
  sidebarCollapsed?: boolean
}

interface State {
  selectionAction?: SelectionBatchAction
  selection: Array<AssetSearchListAsset>
}

class AssetSearch extends AppComponent<
  Props & PaginationProps<AssetSearchQuery> & SearchProps<AssetSearchVariables>,
  State
> {
  state: State = {
    selection: [],
    selectionAction: QP.parse({
      select: QP.Optional(QP.SelectionBatchAction),
    }).select,
  }

  renderMetadata = () => {
    const { data } = this.props
    return <CollectionHeadMetadata data={data} />
  }

  handleActivateSelection = (selectionAction: SelectionBatchAction) => {
    this.setState({ selectionAction }, () =>
      Router.updateQueryParams({ select: selectionAction }),
    )
  }

  renderAssets: React.ElementType<{
    isMultiline?: boolean
    className?: string
  }> = ({ isMultiline, className }) => {
    const {
      data,
      page,
      showContextMenu,
      showSellButtons,
      isDataStale,
      hasError,
      showSelector,
    } = this.props
    const { selectionAction, selection } = this.state

    // TODO (joshuawu): Design error view
    if (hasError) {
      return null
    }

    return (
      <AssetSearchList
        className={className}
        data={isDataStale ? null : data ? getNodes(data.search) : null}
        page={page}
        pageSize={PAGE_SIZE}
        selection={selection}
        selectionContext={
          showSelector
            ? {
                action: selectionAction,
                activate: this.handleActivateSelection,
                select: asset => {
                  const newSelection = selection.some(
                    a => a.relayId === asset.relayId,
                  )
                    ? selection.filter(a => a.relayId !== asset.relayId)
                    : [...selection, asset]
                  if (newSelection.length > SELECTION_MAX_SIZE) {
                    this.showErrorMessage(
                      `A bundle can't have more than ${SELECTION_MAX_SIZE} items.`,
                    )
                    return
                  }
                  this.setState({ selection: newSelection })
                },
              }
            : undefined
        }
        showContextMenu={showContextMenu}
        showSellButtons={showSellButtons}
        variant={isMultiline ? "grid" : "horizontal"}
      />
    )
  }

  setCategoryFilter = (category: string) => {
    const { update, searchState } = this.props
    update({
      categories:
        searchState.categories?.length && searchState.categories[0] === category
          ? undefined
          : [category],
      collection: undefined,
      collections: [],
    })
  }

  renderFilter: React.ElementType<{
    className?: string
    renderFn?: (
      renderContent: (close: () => unknown) => JSX.Element,
    ) => JSX.Element
    variant?: "lazy" | "default"
  }> = ({ className, renderFn, variant = "default" }) => {
    const {
      data,
      collectionPanelMode,
      clear,
      update,
      searchState,
      hideAssetCount,
      includeCollectionFilter,
      includeCategoryFilter,
      sidebarCollapsed,
    } = this.props

    const AssetSearchFilterComponent =
      variant === "default" ? AssetSearchFilter : SuspendedLazyAssetSearchFilter

    return (
      <AssetSearchFilterComponent
        className={className}
        clear={clear}
        collectionPanelMode={collectionPanelMode}
        dataKey={variant === "default" ? data : null}
        hideAssetCount={hideAssetCount}
        includeCategoryFilter={includeCategoryFilter}
        includeCollectionFilter={includeCollectionFilter}
        renderFn={renderFn}
        setCategoryFilter={this.setCategoryFilter}
        setChains={chains => update({ chains })}
        setCollectionSlugs={collections =>
          update({
            collection: collections ? collections[0] : undefined,
            collections: collections ? collections : [],
          })
        }
        setNumericTrait={(name, range) =>
          update({
            numericTraits: [
              ...(searchState.numericTraits?.filter(t => t.name !== name) ||
                []),
              ...(range ? [{ name, ranges: [range] }] : []),
            ],
          })
        }
        setPaymentAssets={(paymentAssets?: string[]) =>
          update({ paymentAssets })
        }
        setPriceFilter={priceFilter =>
          update({ priceFilter: priceFilter || undefined })
        }
        setStringTrait={(name, values) =>
          update({
            stringTraits: [
              ...(searchState.stringTraits?.filter(t => t.name !== name) || []),
              ...(values ? [{ name, values }] : []),
            ],
          })
        }
        setToggles={toggles => update({ toggles })}
        sidebarCollapsed={sidebarCollapsed}
        state={searchState}
      />
    )
  }

  renderSearchPills: React.ElementType<{
    style?: React.CSSProperties
    showResultCount?: boolean
  }> = ({ style, showResultCount }) => {
    const { data, clear, onClear, searchState, update } = this.props

    return (
      <SearchPills
        collections={searchState.collections || []}
        data={data}
        items={[
          ...(searchState.query
            ? [
                {
                  label: searchState.query,
                  onDelete: () => update({ query: undefined }),
                },
              ]
            : []),
          ...flatMap(searchState.stringTraits || [], trait =>
            trait.values.map(value => ({
              label: snakeCaseToSentenceCase(value),
              onDelete: () => {
                const traitValues = trait?.values?.filter(v => v !== value)
                return update({
                  stringTraits: [
                    ...(searchState.stringTraits?.filter(
                      t => t.name !== trait.name,
                    ) || []),
                    ...(trait && traitValues?.length
                      ? [{ name: trait.name, values: traitValues }]
                      : []),
                  ],
                })
              },
            })),
          ),
          ...flatMap(searchState.numericTraits || [], trait =>
            trait.ranges.map(range => ({
              label: `${snakeCaseToSentenceCase(trait.name)}: ${range.min} - ${
                range.max
              }`,
              onDelete: () =>
                update({
                  numericTraits:
                    searchState.numericTraits?.filter(
                      t => t.name !== trait.name,
                    ) || [],
                }),
            })),
          ),
          ...(searchState.paymentAssets?.map(symbol => ({
            label: symbol,
            onDelete: () =>
              update({
                paymentAssets:
                  searchState.paymentAssets?.filter(s => s !== symbol) || [],
              }),
          })) || []),
          ...(searchState.priceFilter
            ? [
                {
                  label: priceFilterLabel(searchState.priceFilter),
                  onDelete: () => update({ priceFilter: undefined }),
                },
              ]
            : []),
          ...(searchState.chains?.map(chain => ({
            label: CHAIN_IDENTIFIERS_TO_NAMES[chain],
            imageUrl: CHAIN_IDENTIFIER_INFORMATION[chain].logo,
            onDelete: () =>
              update({
                chains: searchState.chains?.filter(c => c !== chain) || [],
              }),
          })) || []),
          ...(searchState.toggles?.map(toggle => ({
            label:
              POSSIBLE_FILTER_ITEMS.find(item => item.filter === toggle)
                ?.label || "",
            onDelete: () =>
              update({
                toggles: searchState.toggles?.filter(t => t !== toggle),
              }),
          })) || []),
        ]}
        resultCount={data?.search?.totalCount}
        showResultCount={showResultCount}
        style={style}
        onClear={async () => {
          await clear()

          if (onClear) {
            onClear()
          }
        }}
        onDeleteCollection={slug =>
          update({
            collections:
              searchState.collections?.filter(
                collection => collection !== slug,
              ) || [],
          })
        }
      />
    )
  }

  renderSelection = () => {
    const { selectionAction, selection } = this.state
    return (
      <span>
        {selectionAction && (
          <AssetSelection
            action={selectionAction}
            selection={selection}
            onClear={() =>
              this.setState({ selectionAction: undefined, selection: [] }, () =>
                Router.updateQueryParams({ select: undefined }),
              )
            }
            onDelete={relayId =>
              this.setState({
                selection: selection.filter(a => a.relayId !== relayId),
              })
            }
          />
        )}
      </span>
    )
  }

  render() {
    const { children, data, clear, update, searchState, isDataStale } =
      this.props

    return children({
      Assets: this.renderAssets,
      Filter: this.renderFilter,
      Pills: this.renderSearchPills,
      Metadata: this.renderMetadata,
      Selection: this.renderSelection,
      clear: clear,
      state: searchState,
      totalCount: isDataStale ? undefined : data?.search?.totalCount,
      update: update,
    })
  }
}

const WithSearch = withSearch<
  AssetSearchVariables,
  Props & PaginationProps<AssetSearchQuery>
>(AssetSearch)

export default paginate<AssetSearchQuery, Props>(
  props => (
    <WithSearch
      type="AssetSearch"
      onSearch={searchState => props.refetch(PAGE_SIZE, searchState)}
      {...props}
      defaultState={{
        ...CLEARED_STATE,
        ...props.defaultState,
        ...props.fixedState,
      }}
    />
  ),
  {
    fragments: {
      data: graphql`
        fragment AssetSearch_data on Query
        @argumentDefinitions(
          categories: { type: "[CollectionSlug!]" }
          chains: { type: "[ChainScalar!]" }
          collection: { type: "CollectionSlug" }
          collectionQuery: { type: "String" }
          collectionSortBy: { type: "CollectionSort" }
          collections: { type: "[CollectionSlug!]" }
          count: { type: "Int", defaultValue: 32 }
          cursor: { type: "String" }
          identity: { type: "IdentityInputType" }
          includeHiddenCollections: { type: "Boolean" }
          numericTraits: { type: "[TraitRangeType!]" }
          paymentAssets: { type: "[PaymentAssetSymbol!]" }
          priceFilter: { type: "PriceFilterType" }
          query: { type: "String" }
          resultModel: { type: "SearchResultModel" }
          shouldShowQuantity: { type: "Boolean", defaultValue: false }
          sortAscending: { type: "Boolean" }
          sortBy: { type: "SearchSortBy" }
          stringTraits: { type: "[TraitInputType!]" }
          toggles: { type: "[SearchToggle!]" }
          showContextMenu: { type: "Boolean", defaultValue: false }
          creator: { type: "IdentityInputType" }
          assetOwner: { type: "IdentityInputType" }
          isPrivate: { type: "Boolean" }
          includeCollectionFilter: { type: "Boolean", defaultValue: true }
          safelistRequestStatuses: { type: "[SafelistRequestStatus!]" }
          includeSearchFilterData: { type: "Boolean", defaultValue: true }
        ) {
          ...CollectionHeadMetadata_data @arguments(collection: $collection)
          ...AssetSearchFilter_data
            @arguments(
              assetOwner: $assetOwner
              assetCreator: $creator
              onlyPrivateAssets: $isPrivate
              chains: $chains
              categories: $categories
              collection: $collection
              collections: $collections
              collectionQuery: $collectionQuery
              collectionSortBy: $collectionSortBy
              includeHiddenCollections: $includeHiddenCollections
              includeCollectionFilter: $includeCollectionFilter
            )
            @include(if: $includeSearchFilterData)

          ...SearchPills_data @arguments(collections: $collections)
          search(
            after: $cursor
            chains: $chains
            categories: $categories
            collections: $collections
            first: $count
            identity: $identity
            numericTraits: $numericTraits
            paymentAssets: $paymentAssets
            priceFilter: $priceFilter
            querystring: $query
            resultType: $resultModel
            sortAscending: $sortAscending
            sortBy: $sortBy
            stringTraits: $stringTraits
            toggles: $toggles
            creator: $creator
            isPrivate: $isPrivate
            safelistRequestStatuses: $safelistRequestStatuses
          ) @connection(key: "AssetSearch_search") {
            edges {
              node {
                ...AssetSearchList_data
                  @arguments(
                    identity: $identity
                    shouldShowQuantity: $shouldShowQuantity
                    showContextMenu: $showContextMenu
                  )
              }
            }
            totalCount
          }
        }
      `,
    },
    query: graphql`
      query AssetSearchQuery(
        $categories: [CollectionSlug!]
        $chains: [ChainScalar!]
        $collection: CollectionSlug
        $collectionQuery: String
        $collectionSortBy: CollectionSort
        $collections: [CollectionSlug!]
        $count: Int
        $cursor: String
        $identity: IdentityInputType
        $includeHiddenCollections: Boolean
        $numericTraits: [TraitRangeType!]
        $paymentAssets: [PaymentAssetSymbol!]
        $priceFilter: PriceFilterType
        $query: String
        $resultModel: SearchResultModel
        $showContextMenu: Boolean = false
        $shouldShowQuantity: Boolean = false
        $sortAscending: Boolean
        $sortBy: SearchSortBy
        $stringTraits: [TraitInputType!]
        $toggles: [SearchToggle!]
        $creator: IdentityInputType
        $assetOwner: IdentityInputType
        $isPrivate: Boolean
        $safelistRequestStatuses: [SafelistRequestStatus!]
      ) {
        query {
          ...AssetSearch_data
            @arguments(
              categories: $categories
              chains: $chains
              collection: $collection
              collectionQuery: $collectionQuery
              collectionSortBy: $collectionSortBy
              collections: $collections
              count: $count
              cursor: $cursor
              identity: $identity
              includeHiddenCollections: $includeHiddenCollections
              numericTraits: $numericTraits
              paymentAssets: $paymentAssets
              priceFilter: $priceFilter
              query: $query
              resultModel: $resultModel
              shouldShowQuantity: $shouldShowQuantity
              sortAscending: $sortAscending
              sortBy: $sortBy
              stringTraits: $stringTraits
              toggles: $toggles
              creator: $creator
              assetOwner: $assetOwner
              isPrivate: $isPrivate
              showContextMenu: $showContextMenu
              safelistRequestStatuses: $safelistRequestStatuses
            )
        }
      }
    `,
  },
)
