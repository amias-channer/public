import React from "react"
import moment from "moment"
import styled, { css } from "styled-components"
import AppComponent from "../../AppComponent.react"
import { MOONPAY_API_CHECK_IP_URL } from "../../constants"
import Block from "../../design-system/Block"
import Button from "../../design-system/Button"
import Flex from "../../design-system/Flex"
import MultiStepModal from "../../design-system/Modal/MultiStepModal.react"
import Tooltip from "../../design-system/Tooltip"
import {
  trackClickBuyNow,
  trackClickBuyWithCard,
} from "../../lib/analytics/events/checkoutEvents"
import {
  trackClosePurchaseFlowMultiModal,
  trackReturnToPreviousStepPurchaseFlowMultiModal,
} from "../../lib/analytics/events/itemEvents"
import { TradeStation_archetype } from "../../lib/graphql/__generated__/TradeStation_archetype.graphql"
import { TradeStation_bundle } from "../../lib/graphql/__generated__/TradeStation_bundle.graphql"
import { TradeStation_data } from "../../lib/graphql/__generated__/TradeStation_data.graphql"
import {
  fragmentize,
  getFirstNode,
  getNodes,
  graphql,
} from "../../lib/graphql/graphql"
import { fromISO8601 } from "../../lib/helpers/datetime"
import { bn, display } from "../../lib/helpers/numberUtils"
import { getScheduledOrderText } from "../../lib/helpers/orders"
import { readRemainingQuantity } from "../../lib/helpers/quantity"
import { selectClassNames } from "../../lib/helpers/styling"
import { readVerificationStatus } from "../../lib/helpers/verification"
import AssetQuantity from "../assets/AssetQuantity.react"
import Badge from "../common/Badge.react"
import ConditionalWrapper from "../common/ConditionalWrapper.react"
import Expiration from "../common/Expiration.react"
import Icon from "../common/Icon.react"
import { sizeMQ } from "../common/MediaQuery.react"
import { VerticalAligned } from "../common/VerticalAligned.react"
import Frame from "../layout/Frame.react"
import BidModalContent from "../modals/BidModalContent.react"
import MultiChainTradingGate from "../modals/MultiChainTradingGate.react"
import NetworkUnsupportedGate from "../modals/NetworkUnsupportedGate.react"
import AskPrice from "./AskPrice.react"
import BuyMultiModal from "./BuyMultiModal.react"
import BuyWithCardMultiModal from "./BuyWithCardMultiModal"
import CheckoutModal from "./CheckoutModal.react"
import MoonPayModal from "./MoonPayModal"
import { MoonPayApiCheckIpResponse } from "./MoonPayModal/types"
import VerifyCollectionModal from "./VerifyCollectionModal.react"

const EXPIRATION_WARNING_THRESHOLD_IN_HOURS = 24
const EXPIRATION_SOON_THRESHOLD_IN_HOURS = 1
const EXPIRED_THRESHOLD_IN_HOURS = 0

interface Props {
  collectionSlug?: string
  archetypeData: TradeStation_archetype | null
  bundleData: TradeStation_bundle | null
  data: TradeStation_data
  onOrdersChanged: () => unknown
}

interface State {
  isMoonPayAllowed?: boolean
}

class TradeStation extends AppComponent<Props, State> {
  state: State = {}

  async componentDidMount() {
    await this.getIsMoonPayAllowed()
  }

  async getIsMoonPayAllowed() {
    const response = await fetch(MOONPAY_API_CHECK_IP_URL)
    const json: MoonPayApiCheckIpResponse = await response.json()
    this.setState({ isMoonPayAllowed: !!json?.isBuyAllowed })
  }

  render() {
    const { data, archetypeData, bundleData, onOrdersChanged, collectionSlug } =
      this.props
    const { wallet } = this.context
    const bestAsk = data.bestAsk
    if (!bestAsk?.makerAssetBundle) {
      return null
    }
    const askPrice = getNodes(bestAsk.takerAssetBundle?.assetQuantities)[0]
    if (!askPrice) {
      return null
    }
    const bidPrice = getNodes(
      data.bestBid?.makerAssetBundle?.assetQuantities,
    )[0]
    const bidPriceQuantity = bidPrice?.quantity ? bn(bidPrice.quantity) : null
    const englishAuctionReservePrice = bestAsk.englishAuctionReservePrice
      ? bn(bestAsk.englishAuctionReservePrice)
      : null
    const { dutchAuctionFinalPrice, orderType } = bestAsk
    const expiration = bestAsk.closedAt
      ? fromISO8601(bestAsk.closedAt)
      : undefined
    const hoursLeft = expiration
      ? moment.duration(expiration.diff(moment.utc())).asHours()
      : undefined
    const expiredWithBids =
      hoursLeft !== undefined &&
      hoursLeft < EXPIRED_THRESHOLD_IN_HOURS &&
      orderType === "ENGLISH" &&
      !!bidPrice
    const askPriceQuantity = askPrice?.quantity ? bn(askPrice?.quantity) : null
    const firstAssetQuantity = getFirstNode(
      bestAsk.makerAssetBundle?.assetQuantities,
    )
    const bestAskRemainingQuantity = readRemainingQuantity(bestAsk)

    const isDeclining =
      orderType === "DUTCH" &&
      askPriceQuantity &&
      dutchAuctionFinalPrice !== null &&
      askPriceQuantity.greaterThan(bn(dutchAuctionFinalPrice))
    const isIncreasing =
      orderType === "DUTCH" &&
      askPriceQuantity &&
      dutchAuctionFinalPrice !== null &&
      askPriceQuantity.lessThan(bn(dutchAuctionFinalPrice))
    const endMoment = bestAsk.priceFnEndedAt
      ? fromISO8601(bestAsk.priceFnEndedAt)
      : expiration
    const hasReachedFinalPrice = endMoment?.isSameOrBefore(moment())
    const symbol = askPrice.asset.symbol
    const displaySymbol = symbol === "WETH" ? "ETH" : symbol
    const ownerPart =
      englishAuctionReservePrice && wallet.isActiveAccount(bestAsk.maker)
        ? `of ${display(
            bn(englishAuctionReservePrice, askPrice.asset.decimals),
            symbol || undefined,
          )} ${displaySymbol} `
        : ""
    const reserveMessage = englishAuctionReservePrice
      ? bidPriceQuantity &&
        bidPriceQuantity.greaterThanOrEqualTo(englishAuctionReservePrice)
        ? ` -- Reserve price ${ownerPart}met!`
        : ` -- Reserve price ${ownerPart}not met.`
      : ""

    const listingTime = fromISO8601(bestAsk.openedAt).local()
    const isScheduledOrderInFuture = listingTime.isAfter(moment())
    const showTopBid =
      bidPriceQuantity &&
      askPriceQuantity &&
      bidPriceQuantity.greaterThan(askPriceQuantity)
    const verificationStatus = readVerificationStatus(
      bestAsk.makerAssetBundle?.assetQuantities,
    )
    const shouldVerifyCollectionDetails =
      !bundleData && !["verified", "safelisted"].includes(verificationStatus)

    const buyModalOnClose = () => {
      if (!firstAssetQuantity?.asset) {
        return
      }
      trackClosePurchaseFlowMultiModal(firstAssetQuantity.asset)
    }

    const buyModalOnPrevious = () => {
      if (!firstAssetQuantity?.asset) {
        return
      }
      trackReturnToPreviousStepPurchaseFlowMultiModal(firstAssetQuantity.asset)
    }

    // HACK: There's an issue where for some reason we don't understand yet `bestAsk.maker` could be undefined
    if (!bestAsk.maker) {
      return null
    }

    const ownsThisItem = wallet.isActiveAccount(bestAsk.maker)

    const isDisabled = ownsThisItem || isScheduledOrderInFuture
    const buyNow = `Buy ${bundleData ? "bundle" : "now"}`
    const assetChain = firstAssetQuantity?.asset?.assetContract.chain

    const viewer = wallet.getActiveAccountKey()

    const checkoutVariables = {
      orderId: bestAsk.relayId,
      asset: askPrice.asset.relayId,
      identity: { address: viewer?.address, chain: assetChain },
    }
    const isBuyWithCardButtonShown =
      this.state.isMoonPayAllowed &&
      assetChain === "MATIC" &&
      orderType !== "ENGLISH"

    const handleBidModalOpen = async (open: () => unknown) => {
      if (!viewer) {
        await this.context.login()
      }
      open()
    }

    const renderBidModal: (onClose: () => unknown) => React.ReactNode =
      onClose => (
        <BidModalContent
          archetypeData={archetypeData}
          bundleData={bundleData}
          tradeData={data}
          onClose={onClose}
          onOrderCreated={onOrdersChanged}
        />
      )

    const renderCheckoutModal: (onClose: () => unknown) => React.ReactNode =
      onClose =>
        firstAssetQuantity && viewer ? (
          <CheckoutModal variables={checkoutVariables} onClose={onClose} />
        ) : null

    const main = (
      <div className="TradeStation--main">
        <div className="TradeStation--ask-label">
          {this.tr(
            orderType === "ENGLISH"
              ? showTopBid
                ? "Top bid"
                : "Minimum bid"
              : "Current price",
          )}
          {reserveMessage}
        </div>
        <div className="TradeStation--price-container">
          {bestAskRemainingQuantity.greaterThan(1) ? (
            <Tooltip content={`Quantity: ${bestAskRemainingQuantity}`}>
              <Badge
                className="TradeStation--quantity-badge"
                icon="filter_none"
                text={`x${bestAskRemainingQuantity}`}
              />
            </Tooltip>
          ) : null}
          {orderType === "ENGLISH" && showTopBid ? (
            <>
              <AssetQuantity
                className="TradeStation--price"
                data={bidPrice}
                size={24}
              />
              <AssetQuantity
                className="TradeStation--fiat-price"
                data={bidPrice}
                secondary
                variant="fiat"
              />
            </>
          ) : (
            <>
              <AskPrice
                className="TradeStation--price"
                data={bestAsk}
                size={24}
              />
              <AskPrice
                className="TradeStation--fiat-price"
                data={bestAsk}
                secondary
                size={24}
                variant="fiat"
              />
            </>
          )}
          {((isDeclining || isIncreasing) && !hasReachedFinalPrice) ||
          orderType === "ENGLISH" ? (
            <VerticalAligned>
              <Tooltip
                content={
                  orderType === "DUTCH" ? (
                    <div>
                      <div>
                        {isIncreasing ? "Price increasing" : "Price declining"}
                      </div>
                      <div>
                        The buy-it-now price is{" "}
                        {isIncreasing ? "increasing" : "declining"} from&nbsp;
                        <Block display="inline" verticalAlign="sub">
                          <AssetQuantity
                            color="white"
                            data={askPrice}
                            isInline
                          />
                        </Block>
                        &nbsp;to&nbsp;
                        <Block display="inline" verticalAlign="sub">
                          <AssetQuantity
                            color="white"
                            data={askPrice}
                            isInline
                            mapQuantity={
                              dutchAuctionFinalPrice
                                ? () => bn(dutchAuctionFinalPrice)
                                : undefined
                            }
                          />
                        </Block>
                        , ending&nbsp;
                        <Expiration endMoment={endMoment} />
                      </div>
                    </div>
                  ) : (
                    "The highest bidder will win the item at the end of the auction."
                  )
                }
              >
                <Icon
                  className={selectClassNames("TradeStation", {
                    "price-auction-icon": true,
                    "price-auction-icon-dutch": orderType === "DUTCH",
                    "price-auction-icon-rising":
                      isIncreasing || orderType === "ENGLISH",
                  })}
                  cursor="pointer"
                  value="transit_enterexit"
                />
              </Tooltip>
            </VerticalAligned>
          ) : null}
        </div>
        <NetworkUnsupportedGate chainIdentifier={assetChain}>
          <MultiChainTradingGate
            chainIdentifier={assetChain}
            collectionSlug={collectionSlug}
          >
            {isDisabled ? (
              <Tooltip
                content={
                  ownsThisItem
                    ? "You own this item."
                    : getScheduledOrderText(
                        listingTime,
                        orderType === "ENGLISH" ? "bid on" : "buy",
                      )
                }
                disabled={!isDisabled}
                placement="right"
              >
                <span className="TradeStation--tooltip-main TradeStation--cta">
                  <Button
                    className="TradeStation--cta"
                    disabled={true}
                    icon="account_balance_wallet"
                  >
                    {orderType === "ENGLISH" ? "Place Bid" : buyNow}
                  </Button>
                </span>
              </Tooltip>
            ) : shouldVerifyCollectionDetails ? (
              <>
                <VerifyCollectionModal
                  assetId={firstAssetQuantity?.asset?.relayId}
                  renderNextModal={
                    orderType === "ENGLISH"
                      ? renderBidModal
                      : renderCheckoutModal
                  }
                  trigger={open => (
                    <Button
                      className="TradeStation--cta"
                      disabled={isDisabled}
                      marginRight="8px"
                      marginTop="8px"
                      onClick={() => {
                        if (orderType !== "ENGLISH") {
                          trackClickBuyNow({
                            assetId: askPrice.asset.relayId,
                          })
                        }
                        open()
                      }}
                    >
                      {this.tr(orderType === "ENGLISH" ? "Place Bid" : buyNow)}
                    </Button>
                  )}
                  onClose={buyModalOnClose}
                  onPrevious={buyModalOnPrevious}
                />
                {isBuyWithCardButtonShown && (
                  <VerifyCollectionModal
                    assetId={firstAssetQuantity?.asset?.relayId}
                    renderNextModal={onClose => (
                      <MoonPayModal
                        chain={assetChain}
                        checkoutVariables={checkoutVariables}
                        fiatValue={
                          askPrice.asset.usdSpotPrice
                            ? bn(askPrice.quantity, askPrice.asset.decimals)
                                .mul(askPrice.asset.usdSpotPrice)
                                .toNumber()
                            : undefined
                        }
                        symbol={symbol ?? undefined}
                        onClose={onClose}
                      />
                    )}
                    trigger={open => (
                      <Button
                        className="TradeStation--cta"
                        disabled={isDisabled}
                        icon="credit_card"
                        marginRight="8px"
                        marginTop="8px"
                        variant="secondary"
                        verticalAlign="bottom"
                        onClick={() => {
                          trackClickBuyWithCard({
                            assetId: askPrice.asset.relayId,
                          })
                          open()
                        }}
                      >
                        {this.tr("Buy with card")}
                      </Button>
                    )}
                    onClose={buyModalOnClose}
                    onPrevious={buyModalOnPrevious}
                  />
                )}
              </>
            ) : (
              <>
                <ConditionalWrapper
                  condition={orderType === "ENGLISH"}
                  wrapper={children => (
                    <MultiStepModal
                      closeOnOverlayClick={false}
                      size="large"
                      trigger={open => (
                        <Block
                          onMouseDownCapture={event => {
                            event.stopPropagation()
                            event.preventDefault()
                            handleBidModalOpen(open)
                          }}
                        >
                          {children}
                        </Block>
                      )}
                    >
                      {onClose =>
                        data ? (
                          <BidModalContent
                            archetypeData={archetypeData}
                            bundleData={bundleData}
                            tradeData={data}
                            onClose={onClose}
                            onOrderCreated={onOrdersChanged}
                          />
                        ) : null
                      }
                    </MultiStepModal>
                  )}
                >
                  <BuyMultiModal
                    assetId={askPrice.asset.relayId}
                    orderChain={assetChain}
                    orderId={bestAsk.relayId}
                    trigger={open => (
                      <Button
                        className="TradeStation--cta"
                        disabled={isDisabled}
                        icon="account_balance_wallet"
                        marginRight="8px"
                        marginTop="8px"
                        onClick={() => {
                          if (orderType !== "ENGLISH") {
                            trackClickBuyNow({
                              assetId: askPrice.asset.relayId,
                            })
                          }
                          open()
                        }}
                      >
                        {this.tr(
                          orderType === "ENGLISH" ? "Place Bid" : buyNow,
                        )}
                      </Button>
                    )}
                    onClose={buyModalOnClose}
                    onPrevious={buyModalOnPrevious}
                  />
                </ConditionalWrapper>
                {isBuyWithCardButtonShown && (
                  <BuyWithCardMultiModal
                    chain={assetChain}
                    checkoutVariables={checkoutVariables}
                    fiatValue={
                      askPrice.asset.usdSpotPrice
                        ? bn(askPrice.quantity, askPrice.asset.decimals)
                            .mul(askPrice.asset.usdSpotPrice)
                            .toNumber()
                        : undefined
                    }
                    symbol={symbol ?? undefined}
                    trigger={open => (
                      <Button
                        className="TradeStation--cta"
                        disabled={isDisabled}
                        icon="credit_card"
                        marginRight="8px"
                        marginTop="8px"
                        variant="secondary"
                        verticalAlign="bottom"
                        onClick={() => {
                          trackClickBuyWithCard({
                            assetId: askPrice.asset.relayId,
                          })
                          open()
                        }}
                      >
                        {this.tr("Buy with card")}
                      </Button>
                    )}
                    onClose={buyModalOnClose}
                    onPrevious={buyModalOnPrevious}
                  />
                )}
              </>
            )}
          </MultiChainTradingGate>
        </NetworkUnsupportedGate>
      </div>
    )
    if (!(bestAsk.priceFnEndedAt || expiration) || hasReachedFinalPrice) {
      return (
        <DivContainer>
          <Frame>{main}</Frame>
        </DivContainer>
      )
    }
    return (
      <DivContainer>
        <Frame>
          <div
            className={selectClassNames("TradeStation", {
              header: true,
              "header-warning":
                hoursLeft !== undefined &&
                hoursLeft < EXPIRATION_WARNING_THRESHOLD_IN_HOURS,
              "header-soon":
                hoursLeft !== undefined &&
                hoursLeft < EXPIRATION_SOON_THRESHOLD_IN_HOURS,
              "header-expired-with-bids": expiredWithBids,
            })}
          >
            <Flex alignItems="center">
              <Icon
                className="TradeStation--header-icon"
                value={expiredWithBids ? "gavel" : "schedule"}
              />
              {expiredWithBids ? (
                <div>Sold! Matching orders on the blockchain.</div>
              ) : (
                <Flex>
                  <Expiration
                    endMoment={endMoment}
                    includeDate={true}
                    postfix={
                      dutchAuctionFinalPrice ? (
                        <>
                          &nbsp;at&nbsp;
                          <AssetQuantity
                            className="TradeStation--header-dutch-final-price"
                            data={askPrice}
                            mapQuantity={() => bn(dutchAuctionFinalPrice)}
                          />
                        </>
                      ) : undefined
                    }
                    prefix={
                      expiration
                        ? "Sale ends"
                        : isIncreasing
                        ? "Price increase ends"
                        : "Price decline ends"
                    }
                  />
                </Flex>
              )}
            </Flex>
            {orderType === "DUTCH" || orderType === "ENGLISH" ? (
              <Tooltip
                content={
                  orderType === "DUTCH" ? (
                    <div>
                      {isIncreasing ? "Increasing" : "Declining"} Price Auction
                      The price of this item{" "}
                      {isIncreasing ? "increases" : "declines"} over time. It
                      can be bought by anyone at any point during the duration
                      of the auction.
                    </div>
                  ) : (
                    <div>
                      Extending Auction <br />A new highest bid placed under 10
                      minutes remaining will extend the auction by an additional
                      10 minutes.
                    </div>
                  )
                }
              >
                <Icon
                  className="TradeStation--header-icon-help"
                  cursor="pointer"
                  value="help"
                />
              </Tooltip>
            ) : null}
          </div>
          {main}
        </Frame>
      </DivContainer>
    )
  }
}

export default fragmentize(TradeStation, {
  fragments: {
    archetypeData: graphql`
      fragment TradeStation_archetype on ArchetypeType
      @argumentDefinitions(
        identity: { type: "IdentityInputType!" }
        chain: { type: "ChainScalar" }
      ) {
        ...BidModalContent_archetype
          @arguments(identity: $identity, chain: $chain)
      }
    `,
    bundleData: graphql`
      fragment TradeStation_bundle on AssetBundleType
      @argumentDefinitions(chain: { type: "ChainScalar" }) {
        ...BidModalContent_bundle @arguments(chain: $chain)
      }
    `,
    data: graphql`
      fragment TradeStation_data on TradeSummaryType {
        bestAsk {
          isFulfillable
          closedAt
          dutchAuctionFinalPrice
          openedAt
          orderType
          priceFnEndedAt
          englishAuctionReservePrice
          relayId
          maker {
            ...wallet_accountKey
          }
          makerAssetBundle {
            assetQuantities(first: 30) {
              edges {
                node {
                  asset {
                    relayId
                    assetContract {
                      chain
                    }
                    collection {
                      slug
                      ...verification_data
                    }
                    ...itemEvents_data
                  }
                  ...quantity_data
                }
              }
            }
          }
          taker {
            ...wallet_accountKey
          }
          takerAssetBundle {
            assetQuantities(first: 1) {
              edges {
                node {
                  quantity
                  asset {
                    symbol
                    decimals
                    relayId
                    usdSpotPrice
                  }
                  ...AssetQuantity_data
                }
              }
            }
          }
          ...AskPrice_data
          ...orderLink_data
          ...quantity_remaining
        }
        bestBid {
          makerAssetBundle {
            assetQuantities(first: 1) {
              edges {
                node {
                  quantity
                  ...AssetQuantity_data
                }
              }
            }
          }
        }
        ...BidModalContent_trade
      }
    `,
  },
})

const DivContainer = styled.div`
  .TradeStation--header {
    align-items: center;
    background-color: ${props => props.theme.colors.background};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text.heading};
    display: flex;
    font-weight: initial;
    padding: 20px 12px;
    justify-content: space-between;

    &.TradeStation--header-warning {
      .TradeStation--header-icon-help {
        color: ${props => props.theme.colors.text.subtle};
      }
    }

    &.TradeStation--header-soon {
      background-color: ${props => props.theme.colors.coral};
      color: ${props => props.theme.colors.white};

      .TradeStation--header-icon-help {
        color: ${props => props.theme.colors.white};
      }
    }

    &.TradeStation--header-expired-with-bids {
      background-color: ${props => props.theme.colors.seaGrass};
      color: ${props => props.theme.colors.white};
    }

    .TradeStation--header-icon {
      margin-right: 8px;
    }

    .TradeStation--header-dutch-final-price {
      display: inline-flex;
      color: inherit;
    }

    .TradeStation--header-tooltip {
      color: black;
      height: 22px;
      margin-left: auto;
    }
  }

  .TradeStation--main {
    background-color: ${props => props.theme.colors.surface};
    padding: 12px;

    .TradeStation--ask-label {
      color: ${props => props.theme.colors.text.subtle};
    }

    .TradeStation--price-container {
      display: flex;
      flex-wrap: wrap;

      .TradeStation--quantity-badge {
        margin: auto 8px auto 0;
      }

      .TradeStation--price {
        font-size: 30px;
      }

      .TradeStation--fiat-price {
        font-size: 15px;
        margin-left: 8px;
        margin-top: 15px;
      }

      .TradeStation--price-auction-icon {
        background-color: ${props => props.theme.colors.text.subtle};
        border-radius: 22px;
        color: ${props => props.theme.colors.white};
        height: 24px;
        margin-left: 4px;
        width: 24px;

        &.TradeStation--price-auction-icon-dutch {
          transform: rotate(270deg);
        }

        &.TradeStation--price-auction-icon-rising {
          transform: rotate(180deg);
        }
      }
    }
  }

  .TradeStation--modal {
    display: inline-block;
  }

  .TradeStation--cta {
    width: 100%;
  }

  .TradeStation--tooltip-main {
    display: inline-block;
  }

  ${sizeMQ({
    tabletL: css`
      .TradeStation--cta {
        width: 300px;
      }
    `,
  })}
`
