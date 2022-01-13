import React from "react"
import styled, { css } from "styled-components"
import Block from "../../../design-system/Block"
import Button from "../../../design-system/Button"
import Modal from "../../../design-system/Modal"
import SpaceBetween from "../../../design-system/SpaceBetween"
import { OfferSearch_data } from "../../../lib/graphql/__generated__/OfferSearch_data.graphql"
import { OfferSearchQuery } from "../../../lib/graphql/__generated__/OfferSearchQuery.graphql"
import { OrderSortOption } from "../../../lib/graphql/__generated__/OrdersQuery.graphql"
import { graphql, refetchify, RefetchProps } from "../../../lib/graphql/graphql"
import { MapNonNullable } from "../../../lib/helpers/type"
import UniswapStationModal from "../../auctions/UniswapStationModal.react"
import { sizeMQ } from "../../common/MediaQuery.react"
import TabbedPanel from "../../layout/TabbedPanel.react"
import Orders from "../../orders/Orders.react"
import FilterButton from "../FilterButton.react"
import { FilterDrawer } from "../FilterDrawer.react"
import SearchPills from "../SearchPills.react"
import withSearch, { SearchProps } from "../WithSearch.react"
import OfferSearchFilter, { getFilterCount } from "./OfferSearchFilter.react"

export type OfferSearchVariables = MapNonNullable<OfferSearchQuery["variables"]>

const CLEARED_STATE: OfferSearchVariables = {
  categories: undefined,
  collections: [],
  identity: undefined,
}

interface Props {
  data: OfferSearch_data | null
  path?: string
  defaultState?: OfferSearchVariables
  initialState: Partial<OfferSearchVariables>
  isCurrentUser?: boolean
  fixedState?: Partial<OfferSearchVariables>
  variant?: "defualt" | "profile"
}

type State = {
  isFilterDrawerOpen: boolean
}

class OfferSearch extends React.Component<
  Props & RefetchProps<OfferSearchQuery> & SearchProps<OfferSearchVariables>,
  State
> {
  state: State = { isFilterDrawerOpen: false }

  renderOffers = () => {
    const {
      isCurrentUser,
      searchState: { categories, collections, identity },
    } = this.props

    const commonVariables = {
      isExpired: false,
      makerAssetIsPayment: true,
      takerAssetCategories: categories || undefined,
      takerAssetCollections: collections || undefined,
      sortBy: "OPENED_AT" as OrderSortOption,
    }

    const offersMade = {
      label: "Offers Made",
      content: (
        <Orders
          hideCta={!isCurrentUser}
          isCurrentUser={isCurrentUser}
          mode="expanded"
          scrollboxClassName="OfferSearch--offers-scrollbox"
          side="bid"
          variables={{
            ...commonVariables,
            isValid: !isCurrentUser || undefined,
            maker: identity || undefined,
            expandedMode: true,
          }}
        />
      ),
    }

    const offersReceived = {
      label: "Offers Received",
      content: (
        <Orders
          hideCta={!isCurrentUser}
          isCurrentUser={isCurrentUser}
          mode="expanded"
          scrollboxClassName="OfferSearch--offers-scrollbox"
          side="bid"
          variables={{
            ...commonVariables,
            isValid: true,
            excludeMaker: identity || undefined,
            takerAssetIsOwnedBy: identity || undefined,
            expandedMode: true,
          }}
        />
      ),
    }

    return (
      <TabbedPanel
        initialActiveTabLabel={offersMade.label}
        tabs={[offersMade, offersReceived]}
      />
    )
  }

  renderFilter = (renderFn?: (content: JSX.Element) => JSX.Element) => {
    const { data, clear, update, searchState } = this.props

    return (
      <OfferSearchFilter
        clear={clear}
        data={data}
        renderFn={renderFn}
        setState={update}
        state={searchState}
      />
    )
  }

  renderSearchPills = () => {
    const { data, clear, searchState, update } = this.props

    return (
      <SearchPills
        collections={searchState.collections || []}
        data={data}
        style={{ padding: 0 }}
        onClear={clear}
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

  render() {
    const {
      isCurrentUser,
      variant = "default",
      searchState,
      clear,
    } = this.props
    const filterCount = getFilterCount(searchState)
    const { isFilterDrawerOpen } = this.state

    return (
      <>
        {variant === "default" && this.renderFilter()}
        <DivContainer>
          <div className="OfferSearch--offers">
            {isCurrentUser && (
              <SpaceBetween marginBottom="24px">
                <Block>
                  <Modal
                    trigger={open => (
                      <Button
                        icon="compare_arrows"
                        marginRight="16px"
                        variant="tertiary"
                        onClick={open}
                      >
                        Convert WETH
                      </Button>
                    )}
                  >
                    <UniswapStationModal />
                  </Modal>

                  <Button
                    href="https://app.zerion.io?utm_source=opensea"
                    icon="bar_chart"
                    variant="tertiary"
                  >
                    Manage Funds
                  </Button>
                </Block>

                {variant === "profile" && (
                  <>
                    <FilterButton
                      count={filterCount}
                      onClick={() =>
                        this.setState({ isFilterDrawerOpen: true })
                      }
                    />
                    <FilterDrawer
                      clearAll={clear}
                      isOpen={isFilterDrawerOpen}
                      onClose={() =>
                        this.setState({ isFilterDrawerOpen: false })
                      }
                    >
                      {() => this.renderFilter(content => <>{content}</>)}
                    </FilterDrawer>
                  </>
                )}
              </SpaceBetween>
            )}

            {this.renderSearchPills()}
            {this.renderOffers()}
          </div>
        </DivContainer>
      </>
    )
  }
}

const WithSearch = withSearch<
  OfferSearchVariables,
  Props & RefetchProps<OfferSearchQuery>
>(OfferSearch)

export default refetchify<OfferSearchQuery, Props>(
  props => (
    <WithSearch
      type="OfferSearch"
      onSearch={searchState => props.refetch(searchState, { force: true })}
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
        fragment OfferSearch_data on Query
        @argumentDefinitions(
          categories: { type: "[CollectionSlug!]" }
          chains: { type: "[ChainScalar!]" }
          collectionQuery: { type: "String" }
          collections: { type: "[CollectionSlug!]" }
          collectionSortBy: { type: "CollectionSort" }
          identity: { type: "IdentityInputType" }
          includeHiddenCollections: { type: "Boolean" }
        ) {
          ...OfferSearchFilter_data
            @arguments(
              categories: $categories
              chains: $chains
              collectionQuery: $collectionQuery
              collections: $collections
              collectionSortBy: $collectionSortBy
              includeHiddenCollections: $includeHiddenCollections
            )
          ...SearchPills_data @arguments(collections: $collections)
        }
      `,
    },
    query: graphql`
      query OfferSearchQuery(
        $categories: [CollectionSlug!]
        $chains: [ChainScalar!]
        $collectionQuery: String
        $collections: [CollectionSlug!]
        $collectionSortBy: CollectionSort
        $identity: IdentityInputType
        $includeHiddenCollections: Boolean
      ) {
        query {
          ...OfferSearch_data
            @arguments(
              categories: $categories
              chains: $chains
              collectionQuery: $collectionQuery
              collections: $collections
              collectionSortBy: $collectionSortBy
              identity: $identity
              includeHiddenCollections: $includeHiddenCollections
            )
        }
      }
    `,
  },
)

const DivContainer = styled.div`
  width: 100%;

  .OfferSearch--offers-scrollbox {
    max-height: 800px;
  }

  ${sizeMQ({
    mobile: css`
      flex: 1 0;
      min-width: 0;

      .OfferSearch--offers {
        padding: 24px 32px;
      }
    `,
  })}
`
