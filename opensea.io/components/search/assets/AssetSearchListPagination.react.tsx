import React from "react"
import { AssetSearchListPagination_data } from "../../../lib/graphql/__generated__/AssetSearchListPagination_data.graphql"
import { AssetSearchListPaginationQuery } from "../../../lib/graphql/__generated__/AssetSearchListPaginationQuery.graphql"
import {
  PaginationProps,
  getNodes,
  graphql,
  paginate,
  GraphQLProps,
} from "../../../lib/graphql/graphql"
import GraphQLComponent from "../../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../../lib/graphql/GraphQLRenderer"
import AssetSearchList, { AssetSearchListProps } from "./AssetSearchList.react"

const PAGE_SIZE = 8

type AssetSearchListPaginationProps = Pick<
  AssetSearchListProps,
  "variant" | "singlePage" | "exclude" | "onClick"
> & {
  NoResults?: React.ElementType
}

class AssetSearchListPagination extends GraphQLComponent<
  AssetSearchListPaginationQuery,
  AssetSearchListPaginationProps &
    AssetSearchListPaginationPaginateProps &
    PaginationProps<AssetSearchListPaginationQuery>
> {
  render() {
    const { data, page, NoResults, variant, singlePage, exclude, onClick } =
      this.props

    return !data?.search || data.search.totalCount > 0 ? (
      <AssetSearchList
        data={data ? getNodes(data.search) : null}
        exclude={exclude}
        page={page}
        pageSize={PAGE_SIZE}
        singlePage={singlePage}
        variant={variant}
        onClick={onClick}
      />
    ) : NoResults ? (
      <NoResults />
    ) : null
  }
}

interface AssetSearchListPaginationPaginateProps {
  data: AssetSearchListPagination_data | null
}

const query = graphql`
  query AssetSearchListPaginationQuery(
    $chains: [ChainScalar!]
    $collections: [CollectionSlug!]
    $count: Int = 10
    $cursor: String
    $identity: IdentityInputType
    $numericTraits: [TraitRangeType!]
    $query: String
    $resultModel: SearchResultModel
    $sortAscending: Boolean
    $sortBy: SearchSortBy
    $stringTraits: [TraitInputType!]
    $toggles: [SearchToggle!]
  ) {
    ...AssetSearchListPagination_data
      @arguments(
        chains: $chains
        collections: $collections
        count: $count
        cursor: $cursor
        identity: $identity
        numericTraits: $numericTraits
        query: $query
        resultModel: $resultModel
        sortAscending: $sortAscending
        sortBy: $sortBy
        stringTraits: $stringTraits
        toggles: $toggles
      )
  }
`

export default withData<
  AssetSearchListPaginationQuery,
  AssetSearchListPaginationProps
>(
  paginate<
    AssetSearchListPaginationQuery,
    AssetSearchListPaginationProps &
      AssetSearchListPaginationPaginateProps &
      GraphQLProps<AssetSearchListPaginationQuery>
  >(AssetSearchListPagination, {
    fragments: {
      data: graphql`
        fragment AssetSearchListPagination_data on Query
        @argumentDefinitions(
          chains: { type: "[ChainScalar!]" }
          collections: { type: "[CollectionSlug!]" }
          count: { type: "Int", defaultValue: 8 }
          cursor: { type: "String" }
          identity: { type: "IdentityInputType" }
          numericTraits: { type: "[TraitRangeType!]" }
          query: { type: "String" }
          resultModel: { type: "SearchResultModel" }
          sortAscending: { type: "Boolean" }
          sortBy: { type: "SearchSortBy" }
          stringTraits: { type: "[TraitInputType!]" }
          toggles: { type: "[SearchToggle!]" }
        ) {
          search(
            after: $cursor
            chains: $chains
            collections: $collections
            first: $count
            identity: $identity
            numericTraits: $numericTraits
            querystring: $query
            resultType: $resultModel
            sortAscending: $sortAscending
            sortBy: $sortBy
            stringTraits: $stringTraits
            toggles: $toggles
          ) @connection(key: "AssetSearchListPagination_search") {
            edges {
              node {
                ...AssetSearchList_data
              }
            }
            totalCount
          }
        }
      `,
    },
    query,
  }),
  query,
)
