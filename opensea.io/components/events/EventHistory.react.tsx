import React from "react"
import moment from "moment"
import styled, { css } from "styled-components"
import { NO_HISTORY_DATA_IMG, NULL_ACCOUNT } from "../../constants"
import Block from "../../design-system/Block"
import Checkbox from "../../design-system/Checkbox"
import Flex from "../../design-system/Flex"
import ScrollingPaginator from "../../design-system/ScrollingPaginator"
import Tooltip from "../../design-system/Tooltip"
import {
  AssetEventEventType,
  EventHistory_data,
} from "../../lib/graphql/__generated__/EventHistory_data.graphql"
import {
  EventHistoryPollQuery,
  EventHistoryPollQueryResponse,
} from "../../lib/graphql/__generated__/EventHistoryPollQuery.graphql"
import { EventHistoryQuery } from "../../lib/graphql/__generated__/EventHistoryQuery.graphql"
import { clearCache } from "../../lib/graphql/environment/middlewares/cacheMiddleware"
import {
  fetch,
  getFirstNode,
  getNodes,
  graphql,
  GraphQLProps,
  Node,
  paginate,
  PaginationProps,
} from "../../lib/graphql/graphql"
import GraphQLComponent from "../../lib/graphql/GraphQLComponent.react"
import { withData } from "../../lib/graphql/GraphQLRenderer"
import { isMultichain } from "../../lib/helpers/chainUtils"
import { fromISO8601 } from "../../lib/helpers/datetime"
import { quantityDisplay } from "../../lib/helpers/numberUtils"
import { readQuantity } from "../../lib/helpers/quantity"
import { appendClassName, selectClassNames } from "../../lib/helpers/styling"
import { themeVariant } from "../../styles/styleUtils"
import { HUES } from "../../styles/themes"
import AccountLink from "../accounts/AccountLink.react"
import AssetCell from "../assets/AssetCell.react"
import AssetQuantity from "../assets/AssetQuantity.react"
import { Icon, MaterialIcon } from "../common/Icon.react"
import Image from "../common/Image.react"
import { sizeMQ } from "../common/MediaQuery.react"
import Row from "../common/Row.react"
import { VerticalAligned } from "../common/VerticalAligned.react"
import Panel from "../layout/Panel.react"
import Scrollbox from "../layout/Scrollbox.react"
import { POSSIBLE_FILTER_ITEMS } from "../search/activity/ActivitySearchFilter.react"
import Dropdown from "../v2/Dropdown.react"
import Pill from "../v2/Pill.react"
import EventTimestamp from "./EventTimestamp"

const PAGE_SIZE = 10
const POLLING_INTERVAL = 30000 // 30 seconds
const DEFAULT_MODE = "default"

interface EventLabelData {
  icon: MaterialIcon
  name: string
}

type Mode = "full" | "fungible" | "nonfungible" | "payouts"

type EventTypeFilter = typeof POSSIBLE_FILTER_ITEMS[number]["filter"]

const EVENT_TYPES: Record<AssetEventEventType, EventLabelData> = {
  BID_ENTERED: { icon: "pan_tool", name: "Bid" },
  BID_WITHDRAWN: { icon: "sentiment_satisfied", name: "Bid Cancel" },
  CREATED: { icon: "local_offer", name: "List" },
  CANCELLED: { icon: "new_releases", name: "Cancel" },
  OFFER_ENTERED: { icon: "pan_tool", name: "Offer" },
  SUCCESSFUL: { icon: "shopping_cart", name: "Sale" },
  TRANSFER: { icon: "swap_horiz", name: "Transfer" },
  APPROVE: { icon: "check_box", name: "Approve" },
  CUSTOM: { icon: "star", name: "Custom" },
  PAYOUT: { icon: "attach_money", name: "Payout" },
  "%future added value": { icon: "question_answer", name: "Unknown" },
}

const BIRTH_LABEL: EventLabelData = {
  icon: "child_friendly",
  name: "Minted",
}

export interface Props {
  className?: string
  mode?: Mode
  scrollboxClassName?: string
  shouldPoll?: boolean
  useWindow?: boolean
  showFilters?: boolean
}

interface State {
  polledData: Array<Node<EventHistoryPollQueryResponse["assetEvents"]>>
  eventTypeFilters: EventTypeFilter[]
}

// This query should be identical to the EventHistory_data fragment and is a workaround until
//  we can get subscriptions working
const pollingQuery = graphql`
  query EventHistoryPollQuery(
    $archetype: ArchetypeInputType
    $categories: [CollectionSlug!]
    $chains: [ChainScalar!]
    $collections: [CollectionSlug!]
    $count: Int = 10
    $cursor: String
    $eventTimestamp_Gt: DateTime
    $eventTypes: [EventType!]
    $identity: IdentityInputType
    $showAll: Boolean = false
  ) {
    assetEvents(
      after: $cursor
      archetype: $archetype
      categories: $categories
      chains: $chains
      collections: $collections
      eventTimestamp_Gt: $eventTimestamp_Gt
      eventTypes: $eventTypes
      first: $count
      identity: $identity
      includeHidden: true
    ) {
      edges {
        node {
          assetBundle @include(if: $showAll) {
            ...AssetCell_assetBundle
          }
          assetQuantity {
            asset @include(if: $showAll) {
              ...AssetCell_asset
            }
            ...quantity_data
          }
          relayId
          eventTimestamp
          eventType
          customEventName
          offerEnteredClosedAt
          devFee {
            asset {
              assetContract {
                chain
              }
            }
            quantity
            ...AssetQuantity_data
          }
          devFeePaymentEvent {
            ...EventTimestamp_data
          }
          fromAccount {
            address
            ...AccountLink_data
          }
          price {
            quantity
            ...AssetQuantity_data
          }
          endingPrice {
            quantity
            ...AssetQuantity_data
          }
          seller {
            ...AccountLink_data
          }
          toAccount {
            ...AccountLink_data
          }
          winnerAccount {
            ...AccountLink_data
          }
          ...EventTimestamp_data
        }
      }
    }
  }
`

class EventHistory extends GraphQLComponent<
  EventHistoryQuery,
  Props & EventHistoryPaginateProps & PaginationProps<EventHistoryQuery>,
  State
> {
  pollingInterval: number | undefined

  state: State = {
    polledData: [],
    eventTypeFilters: this.props.variables.eventTypes ?? [],
  }

  async componentDidMount() {
    const { shouldPoll } = this.props

    if (shouldPoll) {
      this.pollingInterval = window.setInterval(async () => {
        const {
          data,
          variables: {
            archetype,
            collections,
            categories,
            chains,
            identity,
            showAll,
          },
        } = this.props

        const { eventTypeFilters: eventTypes } = this.state

        if (!data) {
          return
        }

        const latestData = this.state.polledData.length
          ? this.state.polledData[0]
          : getFirstNode(data.assetEvents)

        clearCache()
        const newData = await fetch<EventHistoryPollQuery>(pollingQuery, {
          archetype,
          // We generally want to capture ALL events after the latest event. Should be fine unless there are more than 100 events
          // after the latest, which is unlikely since we poll every 10 seconds
          collections,
          categories,
          chains,
          eventTypes,
          identity,
          count: 100,
          eventTimestamp_Gt: latestData?.eventTimestamp,
          showAll,
        })

        const nodes = getNodes(newData?.assetEvents)

        if (nodes.length > 0) {
          this.setState(({ polledData }) => ({
            polledData: [...nodes, ...polledData],
          }))
        }
      }, POLLING_INTERVAL)
    }
  }

  componentWillUnmount() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }
  }

  renderFilters() {
    const { showFilters } = this.props
    if (!showFilters) {
      return null
    }

    return (
      <div className="EventHistory--filters">
        {this.renderFilterDropdown()}
        {this.renderFilterPills()}
      </div>
    )
  }

  refetchEvents() {
    const { refetch } = this.props
    const { eventTypeFilters } = this.state
    refetch(PAGE_SIZE, { eventTypes: eventTypeFilters, showAll: true })
  }

  toggleSelectedEventTypes(eventType: EventTypeFilter) {
    this.setState(
      prev => ({
        ...prev,
        eventTypeFilters: prev.eventTypeFilters.includes(eventType)
          ? prev.eventTypeFilters.filter(e => e !== eventType)
          : [...prev.eventTypeFilters, eventType],
      }),
      this.refetchEvents,
    )
  }

  renderFilterPills() {
    const { eventTypeFilters } = this.state
    if (eventTypeFilters.length === 0) {
      return null
    }

    return (
      <ul className="EventHistory--filter-pills">
        {eventTypeFilters.map(eventType => {
          const label = POSSIBLE_FILTER_ITEMS.find(
            ({ filter }) => filter === eventType,
          )?.label

          if (!label) {
            return null
          }

          return (
            <li className="EventHistory--filter-pill" key={eventType}>
              <Pill
                variant="secondary"
                onDelete={() => this.toggleSelectedEventTypes(eventType)}
              >
                {label}
              </Pill>
            </li>
          )
        })}

        <VerticalAligned>
          <li
            className="EventHistory--filter-dropdown-clear"
            onClick={() =>
              this.setState({ eventTypeFilters: [] }, this.refetchEvents)
            }
          >
            {this.tr("Clear All")}
          </li>
        </VerticalAligned>
      </ul>
    )
  }

  renderFilterDropdown() {
    const { eventTypeFilters } = this.state
    return (
      <Dropdown
        getKey={({ filter }) => filter}
        header={this.tr("Filter")}
        items={POSSIBLE_FILTER_ITEMS}
        render={({ filter, label }) => (
          <div className="EventHistory--filter-option">
            <Checkbox checked={eventTypeFilters.includes(filter)} />
            <VerticalAligned className="EventHistory--filter-option-label">
              {label}
            </VerticalAligned>
          </div>
        )}
        showAllOptions
        onItemClick={({ filter }) => this.toggleSelectedEventTypes(filter)}
      />
    )
  }

  renderContent() {
    const { data, mode = DEFAULT_MODE, page } = this.props
    const { polledData } = this.state
    const assetEvents = [...polledData, ...getNodes(data?.assetEvents)]
    const now = moment()

    return (
      <>
        <Row
          columnIndexClassName={
            mode === "payouts"
              ? {
                  1: "EventHistory--item-col",
                  2: "EventHistory--price-col",
                  3: "EventHistory--quantity-col",
                  4: "EventHistory--earned-col",
                }
              : {
                  0: "EventHistory--event-col",
                  1: "EventHistory--item-col",
                  2: "EventHistory--price-col",
                  3: "EventHistory--quantity-col",
                }
          }
          isHeader
          spaced
        >
          {/* Use `undefined` where you want the column to be collapsed and `null` where you want an empty space. */}
          {mode === "payouts"
            ? [
                undefined,
                "Item",
                "Unit Price",
                "Quantity",
                undefined,
                undefined,
                "Fee Earned",
                "Payout",
              ]
            : mode === "nonfungible"
            ? ["Event", undefined, "Price", undefined, "From", "To", "Date"]
            : mode === "fungible"
            ? [
                "Event",
                undefined,
                "Unit Price",
                "Quantity",
                "From",
                "To",
                "Date",
              ]
            : // The configuration for "full", the default.
              ["Event", "Item", "Unit Price", "Quantity", "From", "To", "Date"]}
        </Row>
        {data && assetEvents.length === 0 ? (
          <div className="EventHistory--no-data">
            <Image
              className="EventHistory--no-data-img"
              height={100}
              url={NO_HISTORY_DATA_IMG}
            />
            <div className="EventHistory--no-data-text">
              No trading history yet
            </div>
          </div>
        ) : (
          assetEvents.map(assetEvent => {
            const customEventName = assetEvent.customEventName
            const fromAccount = assetEvent.seller || assetEvent.fromAccount
            const toAccount = assetEvent.winnerAccount || assetEvent.toAccount
            const isBirth =
              assetEvent.fromAccount?.address === NULL_ACCOUNT &&
              assetEvent.eventType === "TRANSFER"

            const eventLabel = isBirth
              ? BIRTH_LABEL
              : assetEvent.eventType && EVENT_TYPES[assetEvent.eventType]

            const expired = assetEvent.offerEnteredClosedAt
              ? fromISO8601(assetEvent.offerEnteredClosedAt).isSameOrBefore(now)
              : false

            const asset = assetEvent?.assetQuantity?.asset
            const assetBundle = assetEvent?.assetBundle

            const quantity =
              mode === "full" || mode === "fungible" || mode === "payouts"
                ? assetEvent.assetQuantity
                  ? readQuantity(assetEvent.assetQuantity)
                  : null // Should not ever happen
                : undefined

            const isSaleWithFeeEarned =
              !!assetEvent.devFee?.quantity && +assetEvent.devFee?.quantity > 0

            const payoutDetail = !isSaleWithFeeEarned ? null : isMultichain(
                assetEvent.devFee?.asset.assetContract.chain,
              ) ? (
              <EventTimestamp data={assetEvent} />
            ) : assetEvent.devFeePaymentEvent ? (
              <EventTimestamp data={assetEvent.devFeePaymentEvent} />
            ) : (
              "Pending"
            )

            return (
              <Row
                className={selectClassNames("EventHistory", {
                  row: true,
                  polledData: polledData.includes(assetEvent),
                  dimmed: !isSaleWithFeeEarned && mode === "payouts",
                })}
                columnIndexClassName={
                  mode === "payouts"
                    ? {
                        1: "EventHistory--item-col",
                        2: "EventHistory--price-col",
                        3: "EventHistory--quantity-col",
                        4: "EventHistory--earned-col",
                      }
                    : {
                        0: "EventHistory--event-col",
                        1: "EventHistory--item-col",
                        2: "EventHistory--price-col",
                        3: "EventHistory--quantity-col",
                      }
                }
                key={assetEvent.relayId}
                spaced
              >
                {mode === "payouts" ? undefined : eventLabel ? (
                  <>
                    <Icon
                      className="EventHistory--icon"
                      value={eventLabel.icon}
                    />
                    <span>{customEventName || eventLabel.name}</span>
                    {expired ? (
                      <Block
                        as="span"
                        color={HUES.coral}
                        fontSize="11px"
                        fontWeight="500"
                        marginLeft="8px"
                      >
                        Expired
                      </Block>
                    ) : null}
                  </>
                ) : null}
                {mode === "full" || mode === "payouts" ? (
                  <AssetCell
                    asset={asset || null}
                    assetBundle={assetBundle || null}
                  />
                ) : undefined}
                {assetEvent.price ? (
                  <div className="EventHistory--prices">
                    <AssetQuantity
                      className="EventHistory--price"
                      data={assetEvent.price}
                      mapQuantity={q => (quantity ? q.div(quantity) : q)}
                    />
                    {assetEvent.endingPrice &&
                    assetEvent.endingPrice.quantity !==
                      assetEvent.price.quantity ? (
                      <>
                        <Tooltip
                          content={
                            <Flex alignItems="center">
                              Price declines from&nbsp;
                              <AssetQuantity
                                color="white"
                                data={assetEvent.price}
                                isInline
                                mapQuantity={q =>
                                  quantity ? q.div(quantity) : q
                                }
                              />
                              &nbsp;to&nbsp;
                              <AssetQuantity
                                color="white"
                                data={assetEvent.endingPrice}
                                isInline
                                mapQuantity={q =>
                                  quantity ? q.div(quantity) : q
                                }
                              />
                            </Flex>
                          }
                        >
                          <Icon value="keyboard_arrow_right" />
                        </Tooltip>
                        <AssetQuantity
                          className="EventHistory--price"
                          data={assetEvent.endingPrice}
                          mapQuantity={q => (quantity ? q.div(quantity) : q)}
                        />
                      </>
                    ) : null}
                  </div>
                ) : null}
                {quantity && quantityDisplay(quantity)}
                {mode === "payouts"
                  ? undefined
                  : fromAccount && (
                      <AccountLink dataKey={fromAccount} handleOverflow />
                    )}
                {mode === "payouts"
                  ? undefined
                  : toAccount && (
                      <AccountLink dataKey={toAccount} handleOverflow />
                    )}
                {mode === "payouts" ? (
                  assetEvent.devFee?.quantity &&
                  +assetEvent.devFee?.quantity > 0 ? (
                    <AssetQuantity
                      className="EventHistory--price"
                      data={assetEvent.devFee}
                    />
                  ) : (
                    <Tooltip
                      content={this.tr(
                        "This may have been a private listing, a listing made at a time when there was no fee on the collection, a listing that sold for zero value, or a listing fulfilled on a different marketplace. If you believe this sale should have earned a fee, please let us know.",
                      )}
                    >
                      <div className="EventHistory--no-payout-earned">None</div>
                    </Tooltip>
                  )
                ) : undefined}
                {mode === "payouts" ? (
                  payoutDetail
                ) : (
                  <EventTimestamp data={assetEvent} />
                )}
              </Row>
            )
          })
        )}
        <ScrollingPaginator
          intersectionOptions={{ rootMargin: "512px" }}
          isFirstPageLoading={!data}
          page={page}
          size={PAGE_SIZE}
        />
      </>
    )
  }

  render() {
    const {
      className,
      mode = DEFAULT_MODE,
      scrollboxClassName,
      useWindow,
    } = this.props

    return (
      <DivContainer className={className}>
        <Panel
          bodyClassName="EventHistory--Panel"
          icon="swap_vert"
          isContentPadded={false}
          mode={
            mode === "full" || mode === "payouts" ? "always-open" : "start-open"
          }
          title={this.tr(
            mode === "payouts" ? "Payout History" : "Trading History",
          )}
        >
          {this.renderFilters()}

          {useWindow ? (
            this.renderContent()
          ) : (
            <Scrollbox
              className={appendClassName(
                "EventHistory--container",
                scrollboxClassName,
              )}
            >
              {this.renderContent()}
            </Scrollbox>
          )}
        </Panel>
      </DivContainer>
    )
  }
}

const query = graphql`
  query EventHistoryQuery(
    $archetype: ArchetypeInputType
    $bundle: BundleSlug
    $collections: [CollectionSlug!]
    $categories: [CollectionSlug!]
    $chains: [ChainScalar!]
    $eventTypes: [EventType!]
    $cursor: String
    $count: Int = 10
    $showAll: Boolean = false
    $identity: IdentityInputType
  ) {
    ...EventHistory_data
      @arguments(
        cursor: $cursor
        count: $count
        archetype: $archetype
        bundle: $bundle
        showAll: $showAll
        eventTypes: $eventTypes
        collections: $collections
        categories: $categories
        chains: $chains
        identity: $identity
      )
  }
`

interface EventHistoryPaginateProps {
  data: EventHistory_data | null
}

export default withData<EventHistoryQuery, Props>(
  paginate<
    EventHistoryQuery,
    Props & EventHistoryPaginateProps & GraphQLProps<EventHistoryQuery>
  >(EventHistory, {
    fragments: {
      data: graphql`
        fragment EventHistory_data on Query
        @argumentDefinitions(
          archetype: { type: "ArchetypeInputType" }
          bundle: { type: "BundleSlug" }
          categories: { type: "[CollectionSlug!]" }
          collections: { type: "[CollectionSlug!]" }
          chains: { type: "[ChainScalar!]" }
          eventTypes: { type: "[EventType!]" }
          cursor: { type: "String" }
          count: { type: "Int", defaultValue: 10 }
          identity: { type: "IdentityInputType" }
          showAll: { type: "Boolean", defaultValue: false }
        ) {
          assetEvents(
            after: $cursor
            bundle: $bundle
            archetype: $archetype
            first: $count
            categories: $categories
            collections: $collections
            chains: $chains
            eventTypes: $eventTypes
            identity: $identity
            includeHidden: true
          ) @connection(key: "EventHistory_assetEvents") {
            edges {
              node {
                assetBundle @include(if: $showAll) {
                  ...AssetCell_assetBundle
                }
                assetQuantity {
                  asset @include(if: $showAll) {
                    ...AssetCell_asset
                  }
                  ...quantity_data
                }
                relayId
                eventTimestamp
                eventType
                offerEnteredClosedAt
                customEventName
                devFee {
                  asset {
                    assetContract {
                      chain
                    }
                  }
                  quantity
                  ...AssetQuantity_data
                }
                devFeePaymentEvent {
                  ...EventTimestamp_data
                }
                fromAccount {
                  address
                  ...AccountLink_data
                }
                price {
                  quantity
                  ...AssetQuantity_data
                }
                endingPrice {
                  quantity
                  ...AssetQuantity_data
                }
                seller {
                  ...AccountLink_data
                }
                toAccount {
                  ...AccountLink_data
                }
                winnerAccount {
                  ...AccountLink_data
                }
                ...EventTimestamp_data
              }
            }
          }
        }
      `,
    },
    query,
  }),
  query,
)

const DivContainer = styled.div`
  overflow-x: scroll;

  .EventHistory--Panel {
    overflow-x: scroll;
  }

  .EventHistory--container {
    max-height: 332px;
    overflow-x: auto;
    width: 100%;
    -webkit-overflow-scrolling: auto;
  }

  .EventHistory--no-data {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 299px;
    justify-content: center;
    width: 100%;

    .EventHistory--no-data-img {
      ${themeVariant({
        variants: {
          dark: {
            opacity: 0.5,
          },
        },
      })}
    }

    .EventHistory--no-data-text {
      display: flex;
      font-size: 16px;
      margin-top: 4px;
      justify-content: center;
    }
  }

  .EventHistory--filters {
    border-bottom: 1px solid ${props => props.theme.colors.border};
    padding: 16px;

    .EventHistory--filter-pills {
      display: flex;
      flex-wrap: wrap;
      margin: 16px 0 0 0;

      .EventHistory--filter-pill,
      .EventHistory--filter-dropdown-clear {
        margin: 5px;
      }

      .EventHistory--filter-dropdown-clear {
        color: ${props => props.theme.colors.primary};
        cursor: pointer;
        opacity: 0.9;

        @media (hover: hover) {
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }

  .EventHistory--filter-option {
    display: flex;

    .EventHistory--filter-option-label {
      margin-left: 8px;
    }
  }

  .EventHistory--icon {
    font-size: 18px;
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 4px;
  }

  .EventHistory--prices {
    display: flex;
  }

  .EventHistory--price {
    font-weight: 400;
  }

  .EventHistory--price {
    font-weight: 400;
  }

  .EventHistory--item-link {
    color: black;
  }

  .EventHistory--event-col {
    flex-basis: 130px;
  }

  .EventHistory--item-col {
    flex-basis: 80px;
  }

  .EventHistory--price-col {
    flex-basis: 140px;
  }

  .EventHistory--quantity-col {
    flex-basis: 80px;
  }

  .EventHistory--earned-col {
    flex-basis: 80px;
  }

  .EventHistory--polledData {
    animation: dropDown ease 0.4s;
  }

  .EventHistory--dimmed {
    .EventHistory--item-col,
    .EventHistory--price-col,
    .EventHistory--quantity-col,
    .EventHistory--no-payout-earned {
      opacity: 0.5;
    }
  }

  @keyframes dropDown {
    0% {
      transform: translateY(-100%);
    }

    100% {
      transform: translateY(0%);
    }
  }

  ${sizeMQ({
    small: css`
      overflow: auto;

      .EventHistory--Panel {
        overflow-x: auto;
      }

      .EventHistory--item-col {
        flex-basis: 300px;
      }

      .EventHistory--price-col {
        flex-basis: 100px;
      }

      .EventHistory--quantity-col {
        flex-basis: 100px;
      }

      .EventHistory--earned-col {
        flex-basis: 100px;
      }
    `,
    wideScreen: css`
      .EventHistory--price-col {
        flex-basis: 10px;
      }

      .EventHistory--quantity-col {
        flex-basis: 10px;
      }

      .EventHistory--earned-col {
        flex-basis: 10px;
      }

      .EventHistory--event-col {
        flex-basis: 30px;
      }
    `,
  })}
`
