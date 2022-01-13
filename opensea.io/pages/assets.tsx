import React from "react"
import styled, { css } from "styled-components"
import { sizeMQ } from "../components/common/MediaQuery.react"
import ActivitySearch from "../components/search/activity/ActivitySearch.react"
import { PAGE_SIZE } from "../components/search/assets/AssetSearch.react"
import AssetSearchView from "../components/search/assets/AssetSearchView.react"
import { BASE_SORT_OPTIONS, STAFF_SORT_OPTIONS } from "../constants"
import AppContainer from "../containers/AppContainer.react"
import Flex from "../design-system/Flex"
import { assetsQuery } from "../lib/graphql/__generated__/assetsQuery.graphql"
import { graphql, GraphQLInitialProps } from "../lib/graphql/graphql"
import GraphQLPage from "../lib/graphql/GraphQLPage.react"
import QP from "../lib/qp/qp"

export default class Assets extends GraphQLPage<assetsQuery> {
  static query = graphql`
    query assetsQuery(
      $categories: [CollectionSlug!]
      $chains: [ChainScalar!]
      $collection: CollectionSlug
      $collections: [CollectionSlug!]
      $collectionQuery: String
      $collectionSortBy: CollectionSort
      $count: Int
      $cursor: String
      $eventTypes: [EventType!]
      $isListingsTab: Boolean!
      $isActivityTab: Boolean!
      $isSingleCollection: Boolean!
      $numericTraits: [TraitRangeType!]
      $paymentAssets: [PaymentAssetSymbol!]
      $priceFilter: PriceFilterType
      $query: String
      $resultModel: SearchResultModel
      $sortAscending: Boolean
      $sortBy: SearchSortBy
      $stringTraits: [TraitInputType!]
      $toggles: [SearchToggle!]
      $safelistRequestStatuses: [SafelistRequestStatus!]
    ) {
      assets: query @include(if: $isListingsTab) {
        ...AssetSearch_data
          @arguments(
            categories: $categories
            chains: $chains
            collection: $collection
            collections: $collections
            collectionQuery: $collectionQuery
            collectionSortBy: $collectionSortBy
            count: $count
            cursor: $cursor
            includeHiddenCollections: false
            numericTraits: $numericTraits
            paymentAssets: $paymentAssets
            priceFilter: $priceFilter
            query: $query
            resultModel: $resultModel
            sortAscending: $sortAscending
            sortBy: $sortBy
            stringTraits: $stringTraits
            toggles: $toggles
            safelistRequestStatuses: $safelistRequestStatuses
          )
      }
      activity: query @include(if: $isActivityTab) {
        ...ActivitySearch_data
          @arguments(
            categories: $categories
            chains: $chains
            collection: $collection
            collectionQuery: $collectionQuery
            collections: $collections
            collectionSortBy: $collectionSortBy
            eventTypes: $eventTypes
            includeHiddenCollections: false
            isSingleCollection: $isSingleCollection
          )
      }
    }
  `

  static getInitialProps = QP.nextParser(
    { collectionSlug: QP.Optional(QP.string), search: QP.Optional(QP.Search) },
    ({ collectionSlug, search }, context): GraphQLInitialProps<assetsQuery> => {
      const tab = context.asPath?.startsWith("/assets")
        ? "listings"
        : "activity"
      return {
        variables: {
          isSingleCollection: !!collectionSlug,
          collections: collectionSlug ? [collectionSlug] : [],
          collectionSortBy: "SEVEN_DAY_VOLUME",
          count: PAGE_SIZE,
          isListingsTab: tab === "listings",
          isActivityTab: tab === "activity",
          eventTypes: search?.eventTypes ?? ["AUCTION_SUCCESSFUL"],
          ...search,
          collection: collectionSlug,
          safelistRequestStatuses:
            collectionSlug ||
            search?.query ||
            search?.sortBy ||
            search?.collection ||
            search?.collections
              ? undefined
              : ["APPROVED", "VERIFIED"],
        },
      }
    },
  )

  render() {
    const { data, variables } = this.props

    const { isListingsTab, isActivityTab } = variables
    const { isEmbedded, wallet } = this.context
    const isStaff = wallet.isStaff

    return (
      <DivContainer>
        {isListingsTab ? (
          <AssetSearchView
            collectionPanelMode={isEmbedded ? "start-closed" : undefined}
            data={data?.assets || null}
            fixedState={{ includeHiddenCollections: false }}
            initialState={variables}
            isStaff={isStaff}
            path="/assets"
            resultsClassName="assets--AssetSearchView-results"
            showEmptyView
            showFilter
            showModelDropdown
            showPills
            sortOptions={
              isStaff
                ? [...BASE_SORT_OPTIONS, ...STAFF_SORT_OPTIONS]
                : BASE_SORT_OPTIONS
            }
            useAppContainer
            useCollectionMetadata
          />
        ) : isActivityTab ? (
          <AppContainer hideFooter>
            <Flex>
              <ActivitySearch
                collectionPanelMode={isEmbedded ? "start-closed" : undefined}
                data={data?.activity || null}
                fixedState={{ includeHiddenCollections: false }}
                initialState={variables}
                path="/activity"
                useCollectionMetadata
              />
            </Flex>
          </AppContainer>
        ) : null}
      </DivContainer>
    )
  }
}

const DivContainer = styled.div`
  .assets--nav {
    // Small nit to align with the panel height
    margin-top: 1px;
  }

  ${sizeMQ({
    mobile: css`
      .assets--AssetSearchView-results {
        padding: 0 28px;
      }
    `,
  })}
`
