import React from "react"
import moment from "moment"
import styled from "styled-components"
import ExchangeActions from "../../actions/exchange"
import { NO_ASKS_YET_IMG, NO_BIDS_YET_IMG } from "../../constants"
import Block from "../../design-system/Block"
import MultiStepModal from "../../design-system/Modal/MultiStepModal.react"
import ScrollingPaginator from "../../design-system/ScrollingPaginator"
import Table from "../../design-system/Table"
import Tooltip from "../../design-system/Tooltip"
import UnstyledButton from "../../design-system/UnstyledButton"
import { Orders_data } from "../../lib/graphql/__generated__/Orders_data.graphql"
import { OrdersQuery } from "../../lib/graphql/__generated__/OrdersQuery.graphql"
import { clearCache } from "../../lib/graphql/environment/middlewares/cacheMiddleware"
import {
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
import { truncateAddress } from "../../lib/helpers/addresses"
import { isMultichain } from "../../lib/helpers/chainUtils"
import { fromISO8601, fromNowWithSeconds } from "../../lib/helpers/datetime"
import { bn, quantityDisplay } from "../../lib/helpers/numberUtils"
import {
  getScheduledOrderText,
  isOrderV2Enabled,
} from "../../lib/helpers/orders"
import { readQuantity, readRemainingQuantity } from "../../lib/helpers/quantity"
import { EM_DASH } from "../../lib/helpers/stringUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import { UnreachableCaseError } from "../../lib/helpers/type"
import { dispatch } from "../../store"
import { themeVariant } from "../../styles/styleUtils"
import { $blue } from "../../styles/variables"
import AccountLink from "../accounts/AccountLink.react"
import AssetCell from "../assets/AssetCell.react"
import AssetQuantity from "../assets/AssetQuantity.react"
import ConditionalWrapper from "../common/ConditionalWrapper.react"
import Icon, { MaterialIcon } from "../common/Icon.react"
import Image from "../common/Image.react"
import MultiChainTradingGate from "../modals/MultiChainTradingGate.react"
import NetworkUnsupportedGate from "../modals/NetworkUnsupportedGate.react"
import AskPrice from "../trade/AskPrice.react"
import BuyMultiModal from "../trade/BuyMultiModal.react"
import CancelOrderActionModal from "./CancelOrderActionModal"

const PAGE_SIZE = 10

type Mode = "minimal" | "full" | "expanded"

interface Props {
  className?: string
  footer?: React.ReactNode
  hideCta?: boolean
  icon?: MaterialIcon
  isCurrentUser?: boolean
  mode: Mode
  side: "bid" | "ask"
  startClosed?: boolean
  scrollboxClassName?: string
  title?: string
  collectionSlug?: string
}

class Orders extends GraphQLComponent<
  OrdersQuery,
  Props & OrdersPaginateProps & PaginationProps<OrdersQuery>
> {
  async cancelOrder(order: Node<NonNullable<Orders_data["orders"]>>) {
    await dispatch(ExchangeActions.cancelOrderV2(order))
  }

  renderActionButton(order: Node<NonNullable<Orders_data["orders"]>>) {
    const { hideCta, collectionSlug, refetch } = this.props
    const { wallet } = this.context

    if (hideCta) {
      return <Table.Cell />
    }

    const takerAssetQuantity = getFirstNode(
      order.takerAssetBundle.assetQuantities,
    )

    const bidItemQuantity =
      order.side === "BID" && takerAssetQuantity && readRemainingQuantity(order)
    const takerAsset = takerAssetQuantity?.asset
    const decimals = takerAsset?.decimals
    const isMaker = wallet.isActiveAccount(order.maker)
    const canTake = !order.taker || wallet.isActiveAccount(order.taker)
    const assetChain = getFirstNode(order.makerAsset.assetQuantities)?.asset
      .assetContract.chain

    const showFulfillButton =
      order.orderType !== "ENGLISH" &&
      (!bidItemQuantity ||
        (takerAssetQuantity?.asset.ownedQuantity &&
          bn(
            takerAssetQuantity?.asset.ownedQuantity,
            decimals,
            // We support partial fulfills on multi chain
          ).greaterThanOrEqualTo(
            isMultichain(assetChain) ? bn(1) : bidItemQuantity,
          )))

    const listingTime = fromISO8601(order.openedAt).local()
    const isScheduledOrderInFuture = listingTime.isAfter(moment())

    const assetContractAddress = getFirstNode(order.makerAsset.assetQuantities)
      ?.asset.assetContract.address

    const isCtaDisabled = isScheduledOrderInFuture
    return isMaker ? (
      isOrderV2Enabled({
        chain: assetChain,
        address: assetContractAddress,
        slug: collectionSlug,
      }) && order.isFulfillable ? (
        <MultiStepModal
          trigger={open => (
            <UnstyledButton className="Orders--button" onClick={open}>
              {this.tr("Cancel")}
              <Icon
                className="Orders--order-fill-icon"
                value="keyboard_arrow_right"
              />
            </UnstyledButton>
          )}
        >
          {onClose => (
            <CancelOrderActionModal
              variables={{
                orderId: order.relayId,
                maker: { address: order.maker.address, chain: assetChain },
              }}
              onClose={onClose}
              onOrderCancelled={() => {
                clearCache()
                refetch()
              }}
            />
          )}
        </MultiStepModal>
      ) : (
        <UnstyledButton
          className="Orders--button"
          onClick={() => this.cancelOrder(order)}
        >
          {this.tr("Cancel")}
          <Icon
            className="Orders--order-fill-icon"
            value="keyboard_arrow_right"
          />
        </UnstyledButton>
      )
    ) : !showFulfillButton ? null : canTake && assetChain ? (
      <NetworkUnsupportedGate chainIdentifier={assetChain}>
        <MultiChainTradingGate
          chainIdentifier={assetChain}
          collectionSlug={collectionSlug}
        >
          <ConditionalWrapper
            condition={!isCtaDisabled && !!takerAsset}
            wrapper={children =>
              takerAsset ? (
                <BuyMultiModal
                  assetId={takerAsset.relayId}
                  isDisabled={isScheduledOrderInFuture}
                  orderChain={assetChain}
                  orderId={order.relayId}
                  trigger={open => <Block onClick={open}>{children}</Block>}
                />
              ) : (
                <></>
              )
            }
          >
            <Tooltip
              content={
                isScheduledOrderInFuture
                  ? getScheduledOrderText(
                      listingTime,
                      order.side === "ASK" ? "buy" : "sell",
                    )
                  : ""
              }
              disabled={!isCtaDisabled}
            >
              <span>
                <UnstyledButton
                  className={selectClassNames(
                    "Orders",
                    {
                      "order-fill-disabled": isCtaDisabled,
                    },
                    "Orders--button",
                  )}
                  data-testid="OrderCheckoutButton"
                  disabled={isCtaDisabled}
                >
                  {order.side === "ASK" ? "Buy" : "Accept"}
                  <Icon
                    className="Orders--order-fill-icon"
                    value="keyboard_arrow_right"
                  />
                </UnstyledButton>
              </span>
            </Tooltip>
          </ConditionalWrapper>
        </MultiChainTradingGate>
      </NetworkUnsupportedGate>
    ) : (
      <Tooltip
        content={
          order.taker?.address ? (
            <div>
              <div className="Orders--tooltip-header">Private Listing</div>
              <div>
                This listing is reserved for{" "}
                {truncateAddress(order.taker?.address)}.
              </div>
            </div>
          ) : (
            "Private listing"
          )
        }
      >
        <div className="Orders--button Orders--order-fill-disabled">
          BUY
          <Icon
            className="Orders--order-fill-icon"
            value="keyboard_arrow_right"
          />
        </div>
      </Tooltip>
    )
  }

  render() {
    const {
      className,
      data,
      footer,
      isCurrentUser,
      mode = "minimal",
      page,
      side,
      variables: { takerAssetIsOwnedBy },
    } = this.props

    const orders = getNodes(data?.orders)

    const showStatus = isCurrentUser && !takerAssetIsOwnedBy

    const headers = {
      minimal: ["Price", "USD Price", "", "Expiration", "From"],
      full: [
        "Unit Price",
        "USD Unit Price",
        "Quantity",
        "",
        "Expiration",
        "From",
      ],
      expanded: [
        "Item",
        "Unit Price",
        "USD Unit Price",
        "Quantity",
        "",
        "From",
        "Expiration",
        showStatus ? "Status" : "",
      ],
    }

    return (
      <DivContainer className={className}>
        {data && !orders.length ? (
          <div className="Orders--empty">
            <div>
              <Image
                className="Orders--no-data-img"
                height={100}
                url={side === "bid" ? NO_BIDS_YET_IMG : NO_ASKS_YET_IMG}
              />
              <div className="Orders--no-data-text">
                {side === "bid" ? "No offers yet" : "No listings yet"}
              </div>
            </div>
          </div>
        ) : (
          <Block maxHeight="332px" overflowX="auto">
            <Table
              headers={headers[mode]}
              maxColumnWidths={
                mode === "expanded"
                  ? ["auto", "auto", "auto", "auto", "auto", 160, 100, "auto"]
                  : ["auto", "auto", "auto", "auto", 160]
              }
            >
              {orders.map(order => {
                const itemQuantity = getFirstNode(
                  (side === "ask"
                    ? order.makerAssetBundle
                    : order.takerAssetBundle
                  )?.assetQuantities,
                )
                const price = getFirstNode(
                  (side === "ask"
                    ? order.takerAssetBundle
                    : order.makerAssetBundle
                  )?.assetQuantities,
                )

                if (!itemQuantity || !price) {
                  return null
                }

                const maxQuantity = readQuantity(itemQuantity)
                const remainingQuantity = readRemainingQuantity(order)
                const priceElement =
                  side === "ask" ? (
                    <AskPrice data={order} symbolVariant="both" />
                  ) : (
                    <AssetQuantity
                      data={price}
                      mapQuantity={q => q.div(maxQuantity)}
                      symbolVariant="both"
                    />
                  )
                const usdPriceElement =
                  side === "ask" ? (
                    <AskPrice
                      data={order}
                      symbolVariant="both"
                      variant="fiat"
                    />
                  ) : (
                    <AssetQuantity
                      data={price}
                      mapQuantity={q => q.div(maxQuantity)}
                      symbolVariant="both"
                      variant="fiat"
                    />
                  )

                switch (mode) {
                  case "minimal":
                    return (
                      <Table.Row key={order.relayId}>
                        <Table.Cell>{priceElement}</Table.Cell>
                        <Table.Cell>{usdPriceElement}</Table.Cell>
                        <Table.Cell>
                          {this.renderActionButton(order)}
                        </Table.Cell>
                        <Table.Cell>
                          {order.closedAt
                            ? fromNowWithSeconds(fromISO8601(order.closedAt))
                            : EM_DASH}
                        </Table.Cell>
                        <Table.Cell>
                          {order.maker ? (
                            <AccountLink
                              dataKey={order.maker}
                              variant="no-image"
                            />
                          ) : (
                            EM_DASH
                          )}
                        </Table.Cell>
                      </Table.Row>
                    )
                  case "full":
                    return (
                      <Table.Row key={order.relayId}>
                        <Table.Cell>{priceElement}</Table.Cell>
                        <Table.Cell>{usdPriceElement}</Table.Cell>
                        <Table.Cell>
                          {quantityDisplay(remainingQuantity)}
                        </Table.Cell>
                        <Table.Cell>
                          {this.renderActionButton(order)}
                        </Table.Cell>
                        <Table.Cell>
                          {order.closedAt
                            ? fromNowWithSeconds(fromISO8601(order.closedAt))
                            : EM_DASH}
                        </Table.Cell>
                        <Table.Cell>
                          {order.maker ? (
                            <AccountLink
                              dataKey={order.maker}
                              variant="no-image"
                            />
                          ) : (
                            EM_DASH
                          )}
                        </Table.Cell>
                      </Table.Row>
                    )

                  case "expanded": {
                    const assetBundleDisplay =
                      side === "ask"
                        ? order.makerAssetBundleDisplay
                        : order.takerAssetBundleDisplay

                    return (
                      <Table.Row key={order.relayId}>
                        <Table.Cell>
                          <AssetCell
                            asset={null}
                            assetBundle={assetBundleDisplay!}
                          />
                        </Table.Cell>
                        <Table.Cell>{priceElement}</Table.Cell>
                        <Table.Cell>{usdPriceElement}</Table.Cell>
                        <Table.Cell>
                          {quantityDisplay(remainingQuantity)}
                        </Table.Cell>
                        <Table.Cell>
                          {this.renderActionButton(order)}
                        </Table.Cell>
                        <Table.Cell>
                          {order.maker ? (
                            <AccountLink
                              dataKey={order.maker}
                              handleOverflow={false}
                              variant="no-image"
                            />
                          ) : (
                            EM_DASH
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {order.closedAt
                            ? fromNowWithSeconds(fromISO8601(order.closedAt))
                            : EM_DASH}
                        </Table.Cell>
                        <Table.Cell>
                          {showStatus ? (
                            order.isValid ? (
                              "Valid"
                            ) : (
                              <Tooltip
                                content={
                                  <div>
                                    This offer is invalid until there is at
                                    least
                                    <AssetQuantity
                                      className="Orders--tooltip-price"
                                      data={price}
                                      isInline
                                      symbolVariant="raw"
                                    />
                                    in your wallet
                                  </div>
                                }
                              >
                                <div className="Orders--status-text">
                                  Invalid
                                </div>
                              </Tooltip>
                            )
                          ) : (
                            EM_DASH
                          )}
                        </Table.Cell>
                      </Table.Row>
                    )
                  }
                  default:
                    throw new UnreachableCaseError(mode)
                }
              })}
            </Table>
            <ScrollingPaginator
              intersectionOptions={{ rootMargin: "512px" }}
              isFirstPageLoading={!data}
              page={page}
              size={PAGE_SIZE}
            />
          </Block>
        )}
        {footer}
      </DivContainer>
    )
  }
}

interface OrdersPaginateProps {
  data: Orders_data | null
}

const query = graphql`
  query OrdersQuery(
    $cursor: String
    $count: Int = 10
    $excludeMaker: IdentityInputType
    $isExpired: Boolean
    $isValid: Boolean
    $maker: IdentityInputType
    $makerArchetype: ArchetypeInputType
    $makerAssetIsPayment: Boolean
    $takerArchetype: ArchetypeInputType
    $takerAssetCategories: [CollectionSlug!]
    $takerAssetCollections: [CollectionSlug!]
    $takerAssetIsOwnedBy: IdentityInputType
    $takerAssetIsPayment: Boolean
    $sortAscending: Boolean
    $sortBy: OrderSortOption
    $makerAssetBundle: BundleSlug
    $takerAssetBundle: BundleSlug
    $expandedMode: Boolean = false
  ) {
    ...Orders_data
      @arguments(
        cursor: $cursor
        count: $count
        excludeMaker: $excludeMaker
        isExpired: $isExpired
        isValid: $isValid
        maker: $maker
        makerArchetype: $makerArchetype
        makerAssetIsPayment: $makerAssetIsPayment
        takerArchetype: $takerArchetype
        takerAssetIsOwnedBy: $takerAssetIsOwnedBy
        takerAssetCategories: $takerAssetCategories
        takerAssetCollections: $takerAssetCollections
        takerAssetIsPayment: $takerAssetIsPayment
        sortAscending: $sortAscending
        sortBy: $sortBy
        makerAssetBundle: $makerAssetBundle
        takerAssetBundle: $takerAssetBundle
        expandedMode: $expandedMode
      )
  }
`

export default withData<OrdersQuery, Props>(
  paginate<
    OrdersQuery,
    Props & OrdersPaginateProps & GraphQLProps<OrdersQuery>
  >(Orders, {
    fragments: {
      data: graphql`
        fragment Orders_data on Query
        @argumentDefinitions(
          cursor: { type: "String" }
          count: { type: "Int", defaultValue: 10 }
          excludeMaker: { type: "IdentityInputType" }
          isExpired: { type: "Boolean" }
          isValid: { type: "Boolean" }
          maker: { type: "IdentityInputType" }
          makerArchetype: { type: "ArchetypeInputType" }
          makerAssetIsPayment: { type: "Boolean" }
          takerArchetype: { type: "ArchetypeInputType" }
          takerAssetCategories: { type: "[CollectionSlug!]" }
          takerAssetCollections: { type: "[CollectionSlug!]" }
          takerAssetIsOwnedBy: { type: "IdentityInputType" }
          takerAssetIsPayment: { type: "Boolean" }
          sortAscending: { type: "Boolean" }
          sortBy: { type: "OrderSortOption" }
          makerAssetBundle: { type: "BundleSlug" }
          takerAssetBundle: { type: "BundleSlug" }
          expandedMode: { type: "Boolean", defaultValue: false }
        ) {
          orders(
            after: $cursor
            excludeMaker: $excludeMaker
            first: $count
            isExpired: $isExpired
            isValid: $isValid
            maker: $maker
            makerArchetype: $makerArchetype
            makerAssetIsPayment: $makerAssetIsPayment
            takerArchetype: $takerArchetype
            takerAssetCategories: $takerAssetCategories
            takerAssetCollections: $takerAssetCollections
            takerAssetIsOwnedBy: $takerAssetIsOwnedBy
            takerAssetIsPayment: $takerAssetIsPayment
            sortAscending: $sortAscending
            sortBy: $sortBy
            makerAssetBundle: $makerAssetBundle
            takerAssetBundle: $takerAssetBundle
          ) @connection(key: "Orders_orders") {
            edges {
              node {
                closedAt
                isFulfillable
                isValid
                oldOrder
                openedAt
                orderType
                maker {
                  address
                  ...AccountLink_data
                  ...wallet_accountKey
                }
                makerAsset: makerAssetBundle {
                  assetQuantities(first: 1) {
                    edges {
                      node {
                        asset {
                          assetContract {
                            address
                            chain
                          }
                        }
                      }
                    }
                  }
                }
                makerAssetBundle {
                  assetQuantities(first: 30) {
                    edges {
                      node {
                        ...AssetQuantity_data
                        ...quantity_data
                      }
                    }
                  }
                }
                relayId
                side
                taker {
                  ...AccountLink_data
                  ...wallet_accountKey
                }
                taker {
                  address
                }
                takerAssetBundle {
                  assetQuantities(first: 1) {
                    edges {
                      node {
                        asset {
                          ownedQuantity(identity: {})
                          decimals
                          symbol
                          relayId
                          assetContract {
                            address
                          }
                        }
                        quantity
                        ...AssetQuantity_data
                        ...quantity_data
                      }
                    }
                  }
                }
                ...AskPrice_data
                ...orderLink_data
                makerAssetBundleDisplay: makerAssetBundle
                  @include(if: $expandedMode) {
                  ...AssetCell_assetBundle
                }
                takerAssetBundleDisplay: takerAssetBundle
                  @include(if: $expandedMode) {
                  ...AssetCell_assetBundle
                }
                ...quantity_remaining
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
  .Orders--empty {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;

    .Orders--no-data-text {
      display: flex;
      font-size: 16px;
      margin-top: 4px;
      justify-content: center;
    }

    .Orders--no-data-img {
      ${themeVariant({
        variants: {
          dark: {
            opacity: 0.5,
          },
        },
      })}
    }
  }

  .Orders--button {
    /* TODO: Move to shared code. */
    align-items: center;
    border-radius: 5px;
    border: 1px solid ${$blue};
    color: ${$blue};
    cursor: pointer;
    display: flex;
    font-size: 14px;
    font-weight: 600;
    justify-content: center;
    font-size: 10px;
    height: 25px;
    padding: 2px 0 0 8px;
    width: 76px;
  }

  .Orders--order-fill-disabled {
    border: 1px solid ${props => props.theme.colors.gray};
    color: ${props => props.theme.colors.gray};
    cursor: not-allowed;
    opacity: 0.5;
  }

  .Orders--status-text {
    color: ${props => props.theme.colors.error};
  }

  .Orders--tooltip-price {
    color: ${props => props.theme.colors.fog};
    margin: 0 0.3em 0 0.15em;
  }
`
