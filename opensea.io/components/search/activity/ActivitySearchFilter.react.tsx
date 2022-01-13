import React from "react"
import { ActivitySearchFilter_data } from "../../../lib/graphql/__generated__/ActivitySearchFilter_data.graphql"
import {
  ActivitySearchQueryVariables,
  EventType,
} from "../../../lib/graphql/__generated__/ActivitySearchQuery.graphql"
import { fragmentize, graphql } from "../../../lib/graphql/graphql"
import { MapNonNullable } from "../../../lib/helpers/type"
import Panel from "../../layout/Panel.react"
import ChainFilter from "../assets/ChainFilter.react"
import CollectionFilter from "../CollectionFilter.react"
import FeaturedFilter, { Item } from "../FeaturedFilter.react"
import SearchFilter from "../SearchFilter.react"

export const getFilterCount = (state: ActivitySearchQueryVariables): number =>
  [
    ...(state.collections || []),
    ...(state.chains || []),
    ...(state.categories || []),
    ...(state.eventTypes || []),
  ].length

export const POSSIBLE_FILTER_ITEMS: Item<EventType>[] = [
  { filter: "AUCTION_CREATED", label: "Listings" },
  { filter: "AUCTION_SUCCESSFUL", label: "Sales" },
  { filter: "OFFER_ENTERED", label: "Bids" },
  { filter: "ASSET_TRANSFER", label: "Transfers" },
]

interface Props {
  className?: string
  clear: () => unknown
  data: ActivitySearchFilter_data | null
  state: ActivitySearchQueryVariables
  setState: (
    state: Partial<MapNonNullable<ActivitySearchQueryVariables>>,
  ) => unknown
  collectionPanelMode?: Panel["props"]["mode"]
  renderFn?: (content: JSX.Element) => JSX.Element
}

const ActivitySearchFilter = ({
  className,
  clear,
  data,
  state,
  setState,
  collectionPanelMode,
  renderFn,
}: Props) => {
  const filterCount = getFilterCount(state)

  const content = (
    <>
      <FeaturedFilter
        className="ActivitySearchFilter--first-panel"
        filters={state.eventTypes || []}
        possibleFilterItems={POSSIBLE_FILTER_ITEMS}
        setFilters={eventTypes => setState({ eventTypes })}
        title="Event Type"
      />
      <CollectionFilter
        data={data}
        hideAssetCount
        panelMode={collectionPanelMode || "start-open"}
        selectedSlugs={state.collections ? state.collections : []}
        setSlugs={collections => {
          const collection =
            collections?.length === 1 ? collections[0] : undefined

          setState({
            isSingleCollection: !!collection,
            collection,
            collections: collections || [],
          })
        }}
        showScrollbox
        title="Collections"
      />
      <ChainFilter
        activeChains={state.chains || []}
        setChains={chains => setState({ chains })}
      />
    </>
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

export default fragmentize(ActivitySearchFilter, {
  fragments: {
    data: graphql`
      fragment ActivitySearchFilter_data on Query
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
  },
})
