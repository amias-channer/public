import React, { Suspense } from "react"
import _ from "lodash"
import { useFragment, useLazyLoadQuery } from "react-relay"
import { ChainIdentifier } from "../../../../constants"
import {
  AssetSearchFilter_data,
  AssetSearchFilter_data$key,
} from "../../../../lib/graphql/__generated__/AssetSearchFilter_data.graphql"
import { AssetSearchFilterLazyQuery } from "../../../../lib/graphql/__generated__/AssetSearchFilterLazyQuery.graphql"
import {
  AssetSearchQueryVariables,
  PriceFilterType,
  RangeType,
  SearchToggle,
} from "../../../../lib/graphql/__generated__/AssetSearchQuery.graphql"
import { graphql } from "../../../../lib/graphql/graphql"
import Panel from "../../../layout/Panel.react"
import CollectionFilter from "../../CollectionFilter.react"
import FeaturedFilter from "../../FeaturedFilter.react"
import SearchFilter from "../../SearchFilter.react"
import ChainFilter from "../ChainFilter.react"
import NumericTraitFilter from "../NumericTraitFilter.react"
import PaymentFilter from "../PaymentFilter.react"
import PriceFilter from "../PriceFilter.react"
import StringTraitFilter from "../StringTraitFilter.react"
import CategoryFilter from "./../CategoryFilter.react"
import { POSSIBLE_FILTER_ITEMS, getFilterCount } from "./utils"

type Props = Omit<AssetSearchFilterContentProps, "close" | "data"> & {
  className?: string
  clear: () => unknown
  dataKey: AssetSearchFilter_data$key | null
  sidebarCollapsed?: boolean
  renderFn?: (
    renderContent: (close: () => unknown) => JSX.Element,
  ) => JSX.Element
}

export const SuspendedLazyAssetSearchFilter = (
  props: Omit<Props, "dataKey">,
) => {
  return (
    <Suspense fallback={null}>
      <LazyAssetSearchFilter {...props} />
    </Suspense>
  )
}

const LazyAssetSearchFilter = (props: Omit<Props, "dataKey">) => {
  const dataKey = useLazyLoadQuery<AssetSearchFilterLazyQuery>(
    graphql`
      query AssetSearchFilterLazyQuery(
        $assetOwner: IdentityInputType
        $assetCreator: IdentityInputType
        $collectionQuery: String
        $collection: CollectionSlug
        $collections: [CollectionSlug]
        $categories: [CollectionSlug]
        $includeHiddenCollections: Boolean
        $chains: [ChainScalar]
        $collectionSortBy: CollectionSort
      ) {
        ...AssetSearchFilter_data
          @arguments(
            assetOwner: $assetOwner
            assetCreator: $assetCreator
            collection: $collection
            collections: $collections
            collectionQuery: $collectionQuery
            includeHiddenCollections: $includeHiddenCollections
            collections: $collections
            categories: $categories
            chains: $chains
            collectionSortBy: $collectionSortBy
          )
      }
    `,
    {
      assetOwner: props.state.identity,
      assetCreator: props.state.creator,
      collection: props.state.collection,
      collectionQuery: props.state.collectionQuery,
      includeHiddenCollections: props.state.includeHiddenCollections,
      collections: props.state.collections,
      categories: props.state.categories,
      chains: props.state.chains,
      collectionSortBy: props.state.collectionSortBy,
    },
  )

  return <AssetSearchFilter {...props} dataKey={dataKey} />
}

const AssetSearchFilter = ({
  className,
  clear,
  dataKey,
  setCategoryFilter,
  setChains,
  setCollectionSlugs,
  setNumericTrait,
  setPaymentAssets,
  setPriceFilter,
  setStringTrait,
  setToggles,
  collectionPanelMode,
  state,
  hideAssetCount,
  includeCollectionFilter = true,
  includeCategoryFilter = true,
  sidebarCollapsed = false,
  renderFn,
}: Props) => {
  const data = useFragment(
    graphql`
      fragment AssetSearchFilter_data on Query
      @argumentDefinitions(
        assetOwner: { type: "IdentityInputType" }
        assetCreator: { type: "IdentityInputType" }
        onlyPrivateAssets: { type: "Boolean" }
        categories: { type: "[CollectionSlug!]" }
        chains: { type: "[ChainScalar!]" }
        collection: { type: "CollectionSlug" }
        collectionQuery: { type: "String" }
        collectionSortBy: { type: "CollectionSort" }
        collections: { type: "[CollectionSlug!]" }
        includeHiddenCollections: { type: "Boolean" }
        includeCollectionFilter: { type: "Boolean", defaultValue: true }
      ) {
        ...CollectionFilter_data
          @include(if: $includeCollectionFilter)
          @arguments(
            assetOwner: $assetOwner
            categories: $categories
            chains: $chains
            collections: $collections
            includeHidden: $includeHiddenCollections
            query: $collectionQuery
            sortBy: $collectionSortBy
            assetCreator: $assetCreator
            onlyPrivateAssets: $onlyPrivateAssets
          )
        collection(collection: $collection) {
          numericTraits {
            key
            value {
              max
              min
            }
            ...NumericTraitFilter_data
          }
          stringTraits {
            key
            ...StringTraitFilter_data
          }
        }
        ...PaymentFilter_data @arguments(collection: $collection)
      }
    `,
    dataKey,
  )

  const filterCount = getFilterCount(state)

  const renderContent = (close: () => unknown) => {
    return (
      <AssetSearchFilterContent
        close={close}
        collectionPanelMode={collectionPanelMode}
        data={data}
        hideAssetCount={hideAssetCount}
        includeCategoryFilter={includeCategoryFilter}
        includeCollectionFilter={includeCollectionFilter}
        setCategoryFilter={setCategoryFilter}
        setChains={setChains}
        setCollectionSlugs={setCollectionSlugs}
        setNumericTrait={setNumericTrait}
        setPaymentAssets={setPaymentAssets}
        setPriceFilter={setPriceFilter}
        setStringTrait={setStringTrait}
        setToggles={setToggles}
        state={state}
      />
    )
  }

  if (renderFn) {
    return renderFn(renderContent)
  }

  return (
    <SearchFilter
      anchorSide="left"
      className={className}
      clear={clear}
      numFiltersApplied={filterCount}
      sidebarCollapsed={sidebarCollapsed}
    >
      {renderContent}
    </SearchFilter>
  )
}

type AssetSearchFilterContentProps = {
  state: AssetSearchQueryVariables
  setToggles: (toggles?: SearchToggle[]) => Promise<unknown>
  setPriceFilter: (filter?: PriceFilterType) => Promise<unknown>
  includeCollectionFilter?: boolean
  includeCategoryFilter?: boolean
  hideAssetCount?: boolean
  collectionPanelMode?: Panel["props"]["mode"]
  setCollectionSlugs: (slugs: string[] | undefined) => Promise<unknown>
  setChains: (chain?: ChainIdentifier[]) => Promise<unknown>
  setNumericTrait: (key: string, range?: RangeType) => Promise<unknown>
  setPaymentAssets: (paymentAssets?: string[]) => Promise<unknown>
  setStringTrait: (key: string, values?: string[]) => Promise<unknown>
  data: AssetSearchFilter_data | null
  setCategoryFilter: (slug: string) => unknown
  close: () => unknown
}

const AssetSearchFilterContent = ({
  state,
  setToggles,
  setPriceFilter,
  includeCollectionFilter,
  includeCategoryFilter,
  hideAssetCount,
  collectionPanelMode,
  setCollectionSlugs,
  setChains,
  setNumericTrait,
  setPaymentAssets,
  setStringTrait,
  setCategoryFilter,
  data,
  close,
}: AssetSearchFilterContentProps) => {
  const stringTraits = _.orderBy(data?.collection?.stringTraits, "key")
  const numericTraits = _.orderBy(
    data?.collection?.numericTraits.filter(t => t.value.max !== t.value.min),
    "key",
  )

  return (
    <>
      <FeaturedFilter
        filters={state.toggles || []}
        possibleFilterItems={POSSIBLE_FILTER_ITEMS}
        setFilters={setToggles}
        title="Status"
      />
      <PriceFilter
        priceFilter={state.priceFilter ?? undefined}
        setPriceFilter={filter => {
          setPriceFilter(filter)
          close()
        }}
      />

      {includeCollectionFilter && (
        <CollectionFilter
          data={data}
          hideAssetCount={hideAssetCount}
          panelMode={collectionPanelMode || "start-closed"}
          selectedSlugs={state.collections ? state.collections : []}
          setSlugs={setCollectionSlugs}
          showScrollbox
          title="Collections"
        />
      )}
      <ChainFilter activeChains={state.chains || []} setChains={setChains} />
      {includeCategoryFilter && (
        <CategoryFilter
          selectedCategory={
            state.categories?.length ? state.categories[0] : undefined
          }
          setCategoryFilter={setCategoryFilter}
        />
      )}
      <PaymentFilter
        activeSymbols={state.paymentAssets || []}
        data={data}
        setPaymentAssets={setPaymentAssets}
      />
      {stringTraits.map(t => (
        <StringTraitFilter
          data={t}
          hideCounts={!!state.identity}
          key={t.key}
          setValues={values => setStringTrait(t.key, values)}
          values={
            state.stringTraits?.find(st => st.name === t.key)?.values || []
          }
        />
      ))}
      {numericTraits.map(t => (
        <NumericTraitFilter
          data={t}
          key={t.key}
          range={
            (state.numericTraits?.find(nt => nt.name === t.key)?.ranges ||
              [])[0]
          }
          setRange={range => setNumericTrait(t.key, range)}
        />
      ))}
    </>
  )
}

export default AssetSearchFilter
