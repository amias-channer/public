import React from "react"
import moment from "moment"
import styled, { css } from "styled-components"
import AppComponent from "../../../AppComponent.react"
import {
  CHAIN_IDENTIFIERS_TO_NAMES,
  CHAIN_IDENTIFIER_INFORMATION,
} from "../../../constants"
import SpaceBetween from "../../../design-system/SpaceBetween"
import { ActivitySearch_data } from "../../../lib/graphql/__generated__/ActivitySearch_data.graphql"
import { ActivitySearchQuery } from "../../../lib/graphql/__generated__/ActivitySearchQuery.graphql"
import { graphql, refetchify, RefetchProps } from "../../../lib/graphql/graphql"
import { MapNonNullable } from "../../../lib/helpers/type"
import { $nav_height } from "../../../styles/variables"
import PriceHistory from "../../assets/PriceHistory.react"
import CollectionHeadMetadata from "../../collections/CollectionHeadMetadata.react"
import { sizeMQ } from "../../common/MediaQuery.react"
import EventHistory from "../../events/EventHistory.react"
import Panel from "../../layout/Panel.react"
import FilterButton from "../FilterButton.react"
import { FilterDrawer } from "../FilterDrawer.react"
import SearchPills from "../SearchPills.react"
import withSearch, { SearchProps } from "../WithSearch.react"
import ActivitySearchFilter, {
  getFilterCount,
  POSSIBLE_FILTER_ITEMS,
} from "./ActivitySearchFilter.react"

export type ActivitySearchVariables = MapNonNullable<
  ActivitySearchQuery["variables"]
>

const CLEARED_STATE: ActivitySearchVariables = {
  isSingleCollection: false,
  categories: undefined,
  chains: undefined,
  collection: undefined,
  collections: [],
  eventTypes: [],
  identity: undefined,
}

interface Props {
  data: ActivitySearch_data | null
  path?: string
  defaultState?: Partial<ActivitySearchVariables>
  initialState: Partial<ActivitySearchVariables>
  fixedState?: Partial<ActivitySearchVariables>
  hidePriceHistory?: boolean
  collectionPanelMode?: Panel["props"]["mode"]
  navbar?: React.ReactNode
  useCollectionMetadata?: boolean
  variant?: "default" | "profile"
}

type State = {
  isFilterDrawerOpen: boolean
}

class ActivitySearch extends AppComponent<
  Props &
    RefetchProps<ActivitySearchQuery> &
    SearchProps<ActivitySearchVariables>,
  State
> {
  state: State = { isFilterDrawerOpen: false }

  renderPriceHistory = () => {
    const { data, isDataStale, searchState } = this.props

    return searchState.isSingleCollection &&
      !isDataStale &&
      data?.collection?.includeTradingHistory ? (
      <div className="ActivitySearch--price-history">
        <Panel
          icon="timeline"
          isContentPadded={true}
          mode="start-open"
          title={this.tr("Price History")}
        >
          <PriceHistory
            height={270}
            initialDayDurationFilter="90"
            variables={{
              collection: searchState.collection,
              bucketSize: "DAY",
              cutoff: moment().subtract(90, "days").format(),
            }}
            xMaxTickCount={12}
            yMaxTickCount={4}
          />
        </Panel>
      </div>
    ) : null
  }

  renderEventHistory = () => {
    const { searchState } = this.props
    const { isMobile } = this.context

    return (
      <EventHistory
        key={JSON.stringify(searchState)}
        mode="full"
        scrollboxClassName="ActivitySearch--event-history-scrollbox"
        shouldPoll
        useWindow={isMobile}
        variables={{
          categories: searchState.categories,
          chains: searchState.chains,
          collections: searchState.collections,
          eventTypes: searchState.eventTypes,
          identity: searchState.identity,
          showAll: true,
        }}
      />
    )
  }

  renderMetadata = () => {
    const { data } = this.props

    return <CollectionHeadMetadata data={data} />
  }

  renderFilter = (renderFn?: (content: JSX.Element) => JSX.Element) => {
    const { data, clear, update, searchState, collectionPanelMode } = this.props

    return (
      <ActivitySearchFilter
        clear={clear}
        collectionPanelMode={collectionPanelMode}
        data={data}
        renderFn={renderFn}
        setState={update}
        state={searchState}
      />
    )
  }

  renderSearchPills = () => {
    const { clear, data, searchState, update } = this.props

    return (
      <SearchPills
        collections={searchState.collections || []}
        data={data}
        items={[
          ...(searchState.eventTypes?.map(eventType => ({
            label:
              POSSIBLE_FILTER_ITEMS.find(item => item.filter === eventType)
                ?.label || "",
            onDelete: () =>
              update({
                eventTypes: searchState.eventTypes?.filter(
                  e => e !== eventType,
                ),
              }),
          })) || []),
          ...(searchState.chains?.map(chain => ({
            label: CHAIN_IDENTIFIERS_TO_NAMES[chain],
            imageUrl: CHAIN_IDENTIFIER_INFORMATION[chain].logo,
            onDelete: () =>
              update({
                chains: searchState.chains?.filter(c => c !== chain) || [],
              }),
          })) || []),
        ]}
        onClear={clear}
        onDeleteCollection={slug => {
          const collections =
            searchState.collections?.filter(
              collection => collection !== slug,
            ) || []
          const isSingleCollection = collections.length === 1

          update({
            collections,
            isSingleCollection,
          })
        }}
      />
    )
  }

  render() {
    const {
      hidePriceHistory,
      navbar,
      useCollectionMetadata,
      variant = "default",
      searchState,
      clear,
    } = this.props
    const { isFilterDrawerOpen } = this.state
    const filterCount = getFilterCount(searchState)

    return (
      <>
        {useCollectionMetadata ? this.renderMetadata() : null}
        {variant === "default" && this.renderFilter()}

        <DivContainer>
          {navbar}

          {variant === "profile" && (
            <>
              <SpaceBetween margin="16px 24px">
                <span />
                <FilterButton
                  count={filterCount}
                  onClick={() => this.setState({ isFilterDrawerOpen: true })}
                />
              </SpaceBetween>

              <FilterDrawer
                clearAll={clear}
                isOpen={isFilterDrawerOpen}
                onClose={() => this.setState({ isFilterDrawerOpen: false })}
              >
                {() => this.renderFilter(content => <>{content}</>)}
              </FilterDrawer>
            </>
          )}
          {this.renderSearchPills()}
          <div className="ActivitySearch--history">
            {hidePriceHistory ? null : this.renderPriceHistory()}
            <div className="ActivitySearch--event-history">
              {this.renderEventHistory()}
            </div>
          </div>
        </DivContainer>
      </>
    )
  }
}

const WithSearch = withSearch<
  ActivitySearchVariables,
  Props & RefetchProps<ActivitySearchQuery>
>(ActivitySearch)

export default refetchify<ActivitySearchQuery, Props>(
  props => (
    <WithSearch
      type="ActivitySearch"
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
        fragment ActivitySearch_data on Query
        @argumentDefinitions(
          categories: { type: "[CollectionSlug!]" }
          chains: { type: "[ChainScalar!]" }
          collectionQuery: { type: "String" }
          collection: { type: "CollectionSlug" }
          collections: { type: "[CollectionSlug!]" }
          collectionSortBy: { type: "CollectionSort" }
          eventTypes: { type: "[EventType!]" }
          identity: { type: "IdentityInputType" }
          includeHiddenCollections: { type: "Boolean" }
          isSingleCollection: { type: "Boolean!" }
        ) {
          collection(collection: $collection)
            @include(if: $isSingleCollection) {
            includeTradingHistory
          }
          ...CollectionHeadMetadata_data @arguments(collection: $collection)
          ...ActivitySearchFilter_data
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
      query ActivitySearchQuery(
        $categories: [CollectionSlug!]
        $chains: [ChainScalar!]
        $collectionQuery: String
        $collection: CollectionSlug
        $collections: [CollectionSlug!]
        $collectionSortBy: CollectionSort
        $eventTypes: [EventType!]
        $identity: IdentityInputType
        $includeHiddenCollections: Boolean
        $isSingleCollection: Boolean!
      ) {
        query {
          ...ActivitySearch_data
            @arguments(
              categories: $categories
              chains: $chains
              collectionQuery: $collectionQuery
              collection: $collection
              collections: $collections
              collectionSortBy: $collectionSortBy
              eventTypes: $eventTypes
              identity: $identity
              includeHiddenCollections: $includeHiddenCollections
              isSingleCollection: $isSingleCollection
            )
        }
      }
    `,
  },
)

const DivContainer = styled.div`
  overflow: auto;

  .ActivitySearch--history {
    padding: 0;
  }

  .ActivitySearch--event-history-scrollbox {
    // We want the height to at least be within the browser viewport. Unsure regarding a cleaner way
    max-height: calc(100vh - ${$nav_height} - 173px);
  }

  ${sizeMQ({
    mobile: css`
      flex: 1 0;
      min-width: 0;
      padding-bottom: 24px;

      .ActivitySearch--history {
        padding: 0px 24px;
      }
      .ActivitySearch--price-history {
        margin-top: 16px;
      }
      .ActivitySearch--event-history {
        margin-top: 24px;
      }
    `,
  })}
`
