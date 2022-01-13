import React from "react"
import { useFragment } from "react-relay"
import { OfferSearchFilter_data$key } from "../../../lib/graphql/__generated__/OfferSearchFilter_data.graphql"
import { OfferSearchQueryVariables } from "../../../lib/graphql/__generated__/OfferSearchQuery.graphql"
import { graphql } from "../../../lib/graphql/graphql"
import { MapNonNullable } from "../../../lib/helpers/type"
import CollectionFilter from "../CollectionFilter.react"
import SearchFilter from "../SearchFilter.react"

export const getFilterCount = (
  state: MapNonNullable<OfferSearchQueryVariables>,
): number => [...(state.collections || []), ...(state.categories || [])].length

interface Props {
  className?: string
  clear: () => unknown
  data: OfferSearchFilter_data$key | null
  state: MapNonNullable<OfferSearchQueryVariables>
  setState: (
    state: Partial<MapNonNullable<OfferSearchQueryVariables>>,
  ) => unknown
  renderFn?: (content: JSX.Element) => JSX.Element
}

const OfferSearchFilter = ({
  className,
  clear,
  data: dataKey,
  state,
  setState,
  renderFn,
}: Props) => {
  const filterCount = getFilterCount(state)

  const data = useFragment(
    graphql`
      fragment OfferSearchFilter_data on Query
      @argumentDefinitions(
        categories: { type: "[CollectionSlug!]" }
        chains: { type: "[ChainScalar!]" }
        collectionQuery: { type: "String" }
        collectionSortBy: { type: "CollectionSort" }
        collections: { type: "[CollectionSlug!]" }
        includeHiddenCollections: { type: "Boolean" }
      ) {
        ...CollectionFilter_data
          @arguments(
            categories: $categories
            chains: $chains
            collections: $collections
            includeHidden: $includeHiddenCollections
            query: $collectionQuery
            sortBy: $collectionSortBy
          )
      }
    `,
    dataKey,
  )

  const content = (
    <CollectionFilter
      data={data}
      hideAssetCount
      icon="view_comfy"
      panelMode="start-open"
      selectedSlugs={state.collections || []}
      setSlugs={collections =>
        setState({
          collections: collections ? collections : [],
        })
      }
      showScrollbox
      title="Collections"
    />
  )

  if (renderFn) {
    return renderFn(content)
  }

  return (
    <SearchFilter
      className={className}
      clear={clear}
      numFiltersApplied={filterCount}
    >
      {content}
    </SearchFilter>
  )
}

export default OfferSearchFilter
