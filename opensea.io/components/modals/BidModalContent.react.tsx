import React from "react"
import moment, { Moment } from "moment"
import ExchangeActions from "../../actions/exchange"
import AppComponent from "../../AppComponent.react"
import Block from "../../design-system/Block"
import DatePicker from "../../design-system/DatePicker"
import Flex from "../../design-system/Flex"
import Modal from "../../design-system/Modal"
import {
  MultiStepContext,
  withMultiStepFlowContext,
} from "../../design-system/Modal/MultiStepFlow.react"
import Text from "../../design-system/Text"
import Tooltip from "../../design-system/Tooltip"
import { BidModalContent_archetype } from "../../lib/graphql/__generated__/BidModalContent_archetype.graphql"
import { BidModalContent_bundle } from "../../lib/graphql/__generated__/BidModalContent_bundle.graphql"
import { BidModalContent_trade } from "../../lib/graphql/__generated__/BidModalContent_trade.graphql"
import {
  fragmentize,
  getFirstNode,
  getNodes,
  graphql,
  Node,
} from "../../lib/graphql/graphql"
import { OrderedSet } from "../../lib/helpers/array"
import { isMultichain } from "../../lib/helpers/chainUtils"
import { bn, displayUSD } from "../../lib/helpers/numberUtils"
import {
  getTotalAssetQuantity,
  isOrderV2Enabled,
  setTermsAcceptance,
  shouldUseMetaTransactions,
} from "../../lib/helpers/orders"
import { capitalize } from "../../lib/helpers/stringUtils"
import { selectClassNames } from "../../lib/helpers/styling"
import throttle from "../../lib/helpers/throttle"
import {
  readCollectionVerificationStatus,
  readVerificationStatus,
} from "../../lib/helpers/verification"
import Transport from "../../lib/transport"
import { buildAsset } from "../../reducers/assets"
import { buildOrder } from "../../reducers/auctions"
import { buildBundle } from "../../reducers/bundles"
import { dispatch } from "../../store"
import AcknowledgementCheckboxes from "../collections/AcknowledgementCheckboxes.react"
import UnapprovedBundlePanel from "../collections/UnapprovedBundlePanel.react"
import ActionButton from "../common/ActionButton.react"
import PaymentAsset from "../common/PaymentAsset.react"
import { HTML_DATE_FORMAT } from "../forms/DateInput.react"
import Label from "../forms/Label.react"
import NumericInput from "../forms/NumericInput.react"
import TimeInput from "../forms/TimeInput.react"
import OrderCreateActionModal from "../orders/OrderCreateActionModal.react"
import AddFundsModal from "../trade/AddFundsModal.react"
import PaymentTokenInputV2 from "../trade/PaymentTokenInputV2.react"
import Dropdown from "../v2/Dropdown.react"

type Symbol = Node<
  BidModalContent_bundle["assetQuantities"]
>["asset"]["collection"]["paymentAssets"][number]["asset"]["symbol"]

type PaymentAsset = Node<
  BidModalContent_bundle["assetQuantities"]
>["asset"]["collection"]["paymentAssets"]

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

type Props = MultiStepContext & {
  archetypeData: BidModalContent_archetype | null
  bundleData: BidModalContent_bundle | null
  tradeData: BidModalContent_trade
  onOrderCreated?: () => unknown
  onClose: () => unknown
}

interface State {
  balanceSublabel?: string
  errorText?: string
  paymentAssetRelayId: string
  quantity: string
  pricePerUnit: string
  showAddFunds?: boolean
  bidExpiration?: Moment
  customExpirationInputValue?: string
  didAcknowledgeReview: boolean
  didAcknowledgeToS: boolean
}

const RAISE_PRISE_COEFFICIENT = 1.05

class BidModalContent extends AppComponent<Props, State> {
  now = moment()

  offerExpirationOptions = [
    moment(this.now).add(3, "days"),
    moment(this.now).add(1, "week"),
    moment(this.now).add(1, "month"),
  ]

  defaultCustomExpirationDate = moment(this.now).add(1, "day")

  state: State = {
    bidExpiration: this.isEnglishAuction()
      ? moment(this.props.tradeData?.bestAsk?.closedAt).add(7, "days")
      : this.offerExpirationOptions[1],
    // If this is an English auction, we should default to the bestAsk's taker asset
    paymentAssetRelayId:
      (this.isEnglishAuction()
        ? this.getPaymentAssets()?.find(
            paymentAsset =>
              paymentAsset.asset.relayId ===
              getFirstNode(
                this.props.tradeData?.bestAsk?.takerAssetBundle.assetQuantities,
              )?.asset.relayId,
          )?.relayId
        : this.getPaymentAssets()?.[0].relayId) ?? "",
    quantity: "1",
    pricePerUnit:
      this.getMinRaisePrice()?.toString() ?? this.getMinBid()?.toString() ?? "",
    didAcknowledgeReview: false,
    didAcknowledgeToS: false,
    showAddFunds: true,
  }

  validateBalance = throttle(async () => {
    const { wallet } = this.context
    const { quantity, pricePerUnit } = this.state

    const paymentAsset = this.getCurrentPaymentAsset()
    const symbol = paymentAsset?.asset.symbol
    const assetId = paymentAsset?.asset.relayId

    if (!assetId) {
      return false
    }

    this.setState({ errorText: "Checking balance..." })

    const balance = bn(
      (await wallet.getBaseBalance(assetId)) ?? 0,
      paymentAsset?.asset.decimals,
    )

    const showAddFunds =
      balance && balance.lessThan(bn(pricePerUnit).times(bn(quantity)))

    this.setState({
      balanceSublabel: balance
        ? `Balance: ${balance.toFixed(4, 1).toString()} ${symbol}`
        : "",
      errorText: showAddFunds
        ? `Not enough ${symbol} to ${
            this.isEnglishAuction() ? "place bid" : "make offer"
          }`
        : "",
      showAddFunds,
    })

    return !showAddFunds
  })

  getMinBid() {
    const { tradeData } = this.props

    const minBid = this.isEnglishAuction()
      ? getFirstNode(tradeData?.bestAsk?.takerAssetBundle?.assetQuantities)
      : null

    return this.isEnglishAuction()
      ? minBid && bn(minBid.quantity, minBid.asset.decimals)
      : null
  }

  getMinRaisePrice() {
    const { tradeData } = this.props

    const maxValidBid = getFirstNode(
      tradeData?.bestBid?.makerAssetBundle.assetQuantities,
    )

    const maxValidBidBn =
      maxValidBid && bn(maxValidBid.quantity, maxValidBid.asset.decimals)

    return this.isEnglishAuction()
      ? maxValidBidBn?.times(RAISE_PRISE_COEFFICIENT)
      : null
  }

  validate = async () => {
    const { pricePerUnit, quantity, bidExpiration } = this.state

    const bnPricePerUnit = bn(pricePerUnit)
    const bnQuantity = bn(quantity)

    if (
      !bnPricePerUnit.greaterThan(0) ||
      !bnQuantity.greaterThan(0) ||
      !bidExpiration
    ) {
      this.setState({ errorText: "Please fill out all fields" })

      return false
    }

    const paymentAsset = this.getCurrentPaymentAsset()
    const symbol = paymentAsset?.asset.symbol
    const amount = bnPricePerUnit.times(bnQuantity)
    const chain = paymentAsset?.asset.assetContract.chain

    const minRaisePrice = this.getMinRaisePrice()
    const minBidPrice = this.getMinBid()

    if (
      this.isEnglishAuction() &&
      minRaisePrice &&
      amount.lessThan(minRaisePrice)
    ) {
      this.setState({
        errorText: `Place a bid of at least ${minRaisePrice.toString()} ${symbol} to become the highest bidder`,
      })
    }

    if (minBidPrice && amount.lessThan(minBidPrice)) {
      const errorText = `Offer must be at least the minimum price per unit of ${minBidPrice.toString()} ${symbol}`
      this.setState({ errorText })
      return false
    } else if (!isMultichain(chain)) {
      return this.validateBalance()
    }

    this.setState({ errorText: "" })
    return true
  }

  isEnglishAuction() {
    return this.props.tradeData?.bestAsk?.orderType === "ENGLISH"
  }

  // We want to filter out ETH from valid payment assets
  getPaymentAssets() {
    const { archetypeData, bundleData } = this.props

    if (archetypeData) {
      return archetypeData.asset?.collection.paymentAssets.filter(
        paymentAsset =>
          !(
            paymentAsset.asset.symbol === "ETH" &&
            paymentAsset.asset.assetContract.chain === "ETHEREUM"
          ) &&
          paymentAsset.asset.assetContract.chain ===
            archetypeData?.asset?.assetContract.chain,
      )
    }
    if (bundleData) {
      const allPaymentAssets = getNodes(bundleData.assetQuantities).reduce(
        (acc, cur) => {
          acc.push(
            ...cur.asset.collection.paymentAssets.filter(
              paymentAsset =>
                !(
                  paymentAsset.asset.symbol === "ETH" &&
                  paymentAsset.asset.assetContract.chain === "ETHEREUM"
                ),
            ),
          )
          return acc
        },
        [] as Writeable<PaymentAsset>,
      )
      const paymentAssets = new OrderedSet<
        Writeable<PaymentAsset>[number],
        Symbol
      >(paymentAsset => paymentAsset?.asset?.symbol, allPaymentAssets)

      return paymentAssets.elements
    }
    return undefined
  }

  getCurrentPaymentAsset = () => {
    const { paymentAssetRelayId } = this.state

    return this.getPaymentAssets()?.find(
      paymentAsset => paymentAsset.relayId === paymentAssetRelayId,
    )
  }

  renderOfferExpirationDropdown = () => {
    const { bidExpiration, customExpirationInputValue } = this.state

    return (
      <Dropdown
        className="BidModalContent--input-side"
        getKey={expiration => `${expiration?.toString()}`}
        header={capitalize(bidExpiration?.fromNow() ?? "Invalid date")}
        isClosedOnSelect
        items={[
          ...this.offerExpirationOptions.filter(
            expiration => expiration !== bidExpiration,
          ),
          // Sentinel for custom date
          ...(customExpirationInputValue ? [] : [undefined]),
        ]}
        render={expiration =>
          capitalize(expiration?.fromNow(true) ?? "Custom date")
        }
        onItemClick={expiration => {
          this.setState({
            bidExpiration: expiration ?? this.defaultCustomExpirationDate,
            customExpirationInputValue: expiration
              ? undefined
              : this.defaultCustomExpirationDate.format(HTML_DATE_FORMAT),
          })
        }}
      />
    )
  }

  onOrderCreated = () => {
    const { onOrderCreated, onClose } = this.props

    onClose()
    this.showSuccessMessage("Your offer was submitted successfully!")

    onOrderCreated?.()
  }

  getTotalAmount = () => {
    const { pricePerUnit, quantity } = this.state
    return pricePerUnit && quantity
      ? bn(pricePerUnit).mul(quantity).toNumber()
      : null
  }

  onSubmit = async () => {
    const { mutate, wallet } = this.context

    if (!wallet.activeAccount?.user?.hasAffirmativelyAcceptedOpenseaTerms) {
      await this.attempt(setTermsAcceptance(mutate))
    }

    if (await this.validate()) {
      const { archetypeData, bundleData, tradeData, onNext } = this.props
      const { quantity, bidExpiration, pricePerUnit } = this.state

      const assetAddress = archetypeData?.asset?.assetContract.address
      const chain = archetypeData?.asset?.assetContract.chain
      const paymentAsset = this.getCurrentPaymentAsset()
      const totalAmount = this.getTotalAmount()

      if (
        !isOrderV2Enabled({
          address: assetAddress,
          slug: archetypeData?.asset?.collection.slug,
          chain,
        })
      ) {
        const assetRelayId = archetypeData?.asset?.relayId
        const bundleSlug = bundleData?.slug
        if (bundleSlug || assetRelayId) {
          const isAsset = !!assetRelayId
          const response = await Transport.fetch(
            isAsset
              ? `/assets_by_relay_id?relay_ids=${assetRelayId}`
              : `/bundle/${bundleSlug}/`,
          )
          const buildData = isAsset
            ? response.data.map(buildAsset)[0]
            : buildBundle(response)

          const oldOrder = tradeData?.bestAsk?.oldOrder
          const oldOrderJSON = oldOrder ? JSON.parse(oldOrder) : undefined

          const order = await dispatch(
            isAsset
              ? ExchangeActions.placeBuyOrder({
                  asset: buildData,
                  amount: totalAmount ?? 0,
                  quantity: +quantity,
                  expirationTime: bidExpiration?.unix(),
                  paymentTokenAddress:
                    paymentAsset?.asset.assetContract.address,
                  currentSellOrder: oldOrderJSON?.order_hash
                    ? buildOrder(oldOrderJSON)
                    : undefined,
                })
              : ExchangeActions.placeBundleBuyOrder({
                  bundle: buildData,
                  amount: totalAmount ?? 0,
                  expirationTime: bidExpiration?.unix(),
                  paymentTokenAddress:
                    paymentAsset?.asset.assetContract.address,
                  currentSellOrder: oldOrderJSON?.order_hash
                    ? buildOrder(oldOrderJSON)
                    : undefined,
                }),
          )
          order && this.onOrderCreated()

          return order
        }
      } else {
        // TODO dario: Handle OrderV2 bundles
        const makerAssetId = paymentAsset?.asset.relayId
        const takerAssetId = archetypeData?.asset?.relayId

        makerAssetId &&
          takerAssetId &&
          onNext(
            <OrderCreateActionModal
              isEnglishAuction={this.isEnglishAuction()}
              mode="bid"
              variables={{
                maker: {
                  address: wallet.getActiveAccountKey()?.address,
                  chain,
                },
                makerAssetQuantities: [
                  {
                    asset: makerAssetId,
                    quantity: getTotalAssetQuantity({
                      pricePerUnit,
                      quantity,
                      decimals: paymentAsset?.asset.decimals,
                    }).toString(),
                  },
                ],
                takerAssetQuantities: [
                  {
                    asset: takerAssetId,
                    quantity,
                  },
                ],
                expiration: bidExpiration?.unix(),
                useMetaTransactions: shouldUseMetaTransactions({
                  chain,
                  address: assetAddress,
                  slug: archetypeData?.asset?.collection.slug,
                }),
              }}
              onEnd={this.onOrderCreated}
            />,
          )

        return undefined
      }
    }

    return undefined
  }

  render() {
    const {
      archetypeData,
      tradeData,
      bundleData,
      onNext,
      onPrevious,
      onClose,
    } = this.props
    const {
      quantity,
      pricePerUnit,
      showAddFunds,
      errorText,
      balanceSublabel,
      bidExpiration,
      customExpirationInputValue,
      didAcknowledgeReview,
      didAcknowledgeToS,
      paymentAssetRelayId,
    } = this.state

    if (!tradeData) {
      return null
    }

    const paymentAssets = this.getPaymentAssets()
    const paymentAsset = this.getCurrentPaymentAsset()
    const usdSpotPrice = paymentAsset?.asset.usdSpotPrice
    const symbol = paymentAsset?.asset.symbol
    const totalAmount = this.getTotalAmount()
    const totalUSDAmount =
      usdSpotPrice && totalAmount ? usdSpotPrice * totalAmount : null

    const isCustomExpirationDate = customExpirationInputValue !== undefined

    const isFungible =
      !!archetypeData?.quantity && archetypeData?.quantity !== "1"
    const maxQuantity = archetypeData?.quantity ?? "0"

    const assetVerificationStatus = archetypeData?.asset?.collection
      ? readCollectionVerificationStatus(archetypeData?.asset?.collection)
      : undefined

    const makerAssetBundleVerificationStatus = tradeData?.bestAsk
      ?.makerAssetBundle?.assetQuantities
      ? readVerificationStatus(
          tradeData?.bestAsk?.makerAssetBundle?.assetQuantities,
        )
      : undefined

    const verificationStatus =
      makerAssetBundleVerificationStatus ?? assetVerificationStatus

    const shouldPromptTermsAcceptance = !["verified", "safelisted"].includes(
      verificationStatus ?? "unapproved",
    )

    const isBundle = !!bundleData?.slug

    const {
      wallet: { activeAccount },
    } = this.context
    const hasAcceptedTerms =
      !!activeAccount?.user?.hasAffirmativelyAcceptedOpenseaTerms

    return (
      <>
        <Modal.Header onPrevious={onPrevious}>
          <Modal.Title>
            {this.tr(this.isEnglishAuction() ? "Place a bid" : "Make an offer")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {shouldPromptTermsAcceptance && isBundle && <UnapprovedBundlePanel />}
          {isFungible ? (
            <Label label="Quantity">
              <NumericInput
                inputValue={quantity}
                isRequired
                max={bn(maxQuantity)}
                maxDecimals={archetypeData?.asset?.decimals ?? 0}
                placeholder={maxQuantity}
                value={quantity}
                onChange={({ value }) =>
                  value !== undefined &&
                  this.setState({ quantity: value }, this.validate)
                }
              />
            </Label>
          ) : null}
          <Label
            className={selectClassNames("BidModalContent", {
              price: isFungible,
            })}
            label={this.tr(isFungible ? "Price per item" : "Price")}
            subLabel={balanceSublabel ? this.tr(balanceSublabel) : undefined}
          >
            {paymentAssets ? (
              <PaymentTokenInputV2
                dataKey={paymentAssets}
                paymentAssetRelayId={paymentAssetRelayId}
                price={pricePerUnit}
                showSinglePaymentAsset={this.isEnglishAuction()}
                onChange={({ paymentAssetRelayId, price }) => {
                  this.setState(
                    {
                      paymentAssetRelayId,
                      pricePerUnit: price?.toString() ?? "",
                    },
                    this.validate,
                  )
                }}
              />
            ) : null}
          </Label>
          {isFungible ? (
            <Text variant="small">
              Total amount offered:
              {` ${totalAmount || 0} ${symbol} ${
                totalUSDAmount ? `($${displayUSD(totalUSDAmount)})` : ""
              }`}
            </Text>
          ) : null}
          {!this.isEnglishAuction() ? (
            <Label label={this.tr("Offer Expiration")}>
              <Flex>
                <Block marginRight="8px">
                  {this.renderOfferExpirationDropdown()}
                </Block>
                <Block flexGrow={1} minWidth={0}>
                  {isCustomExpirationDate ? (
                    <DatePicker
                      max={moment(this.now).add("6", "months")}
                      min={this.defaultCustomExpirationDate}
                      value={bidExpiration}
                      withTime
                      onChange={value =>
                        this.setState({
                          bidExpiration: value,
                        })
                      }
                    />
                  ) : (
                    <TimeInput
                      value={this.state.bidExpiration}
                      onChange={bidExpiration =>
                        this.setState({ bidExpiration })
                      }
                    />
                  )}
                </Block>
              </Flex>
            </Label>
          ) : null}

          {(!hasAcceptedTerms || (isBundle && shouldPromptTermsAcceptance)) && (
            <AcknowledgementCheckboxes
              hasAcceptedTerms={hasAcceptedTerms}
              isBundle={isBundle}
              isReviewChecked={this.state.didAcknowledgeReview}
              isToSChecked={this.state.didAcknowledgeToS}
              onReviewChecked={value =>
                this.setState({ didAcknowledgeReview: value })
              }
              onToSChecked={value =>
                this.setState({ didAcknowledgeToS: value })
              }
            />
          )}
        </Modal.Body>

        <Modal.Footer>
          <Tooltip content={errorText} disabled={!errorText}>
            <div>
              <ActionButton
                isDisabled={
                  !bn(pricePerUnit).greaterThan(0) ||
                  !bn(quantity).greaterThan(0) ||
                  !!errorText ||
                  (!didAcknowledgeReview &&
                    isBundle &&
                    shouldPromptTermsAcceptance) ||
                  (!didAcknowledgeToS && !hasAcceptedTerms)
                }
                onClick={this.onSubmit}
              >
                {this.tr(this.isEnglishAuction() ? "Place Bid" : "Make Offer")}
              </ActionButton>
            </div>
          </Tooltip>

          {showAddFunds && symbol ? (
            <Block marginLeft="24px">
              <ActionButton
                type="secondary"
                onClick={() =>
                  onNext(
                    <AddFundsModal
                      assetId={paymentAsset?.asset.relayId}
                      fundsToAdd={totalAmount ? bn(totalAmount) : undefined}
                      orderId={tradeData.bestAsk?.relayId}
                      variables={{
                        symbol,
                        chain: paymentAsset?.asset.assetContract.chain,
                      }}
                      onClose={onClose}
                    />,
                  )
                }
              >
                {symbol === "WETH" ? "Convert ETH" : "Add Funds"}
              </ActionButton>
            </Block>
          ) : null}
        </Modal.Footer>
      </>
    )
  }
}

export default fragmentize(withMultiStepFlowContext(BidModalContent), {
  fragments: {
    archetypeData: graphql`
      fragment BidModalContent_archetype on ArchetypeType
      @argumentDefinitions(
        identity: { type: "IdentityInputType!" }
        chain: { type: "ChainScalar" }
      ) {
        asset {
          assetContract {
            address
            chain
          }
          decimals
          relayId
          collection {
            slug
            paymentAssets(chain: $chain) {
              relayId
              asset {
                assetContract {
                  address
                  chain
                }
                decimals
                symbol
                usdSpotPrice
                relayId
              }
              ...PaymentTokenInputV2_data
            }
            ...verification_data
          }
        }
        quantity
        ownedQuantity(identity: $identity)
      }
    `,
    bundleData: graphql`
      fragment BidModalContent_bundle on AssetBundleType
      @argumentDefinitions(chain: { type: "ChainScalar" }) {
        assetQuantities(first: 30) {
          edges {
            node {
              asset {
                assetContract {
                  address
                  chain
                }
                decimals
                relayId
                collection {
                  slug
                  paymentAssets(chain: $chain) {
                    relayId
                    asset {
                      assetContract {
                        address
                        chain
                      }
                      decimals
                      symbol
                      usdSpotPrice
                      relayId
                    }
                    ...PaymentTokenInputV2_data
                  }
                }
              }
              quantity
            }
          }
        }
        slug
      }
    `,
    tradeData: graphql`
      fragment BidModalContent_trade on TradeSummaryType {
        bestAsk {
          closedAt
          isFulfillable
          oldOrder
          orderType
          relayId
          makerAssetBundle {
            assetQuantities(first: 30) {
              edges {
                node {
                  asset {
                    collection {
                      ...verification_data
                    }
                  }
                }
              }
            }
          }
          takerAssetBundle {
            assetQuantities(first: 1) {
              edges {
                node {
                  quantity
                  asset {
                    decimals
                    relayId
                  }
                }
              }
            }
          }
        }
        bestBid {
          relayId
          makerAssetBundle {
            assetQuantities(first: 1) {
              edges {
                node {
                  quantity
                  asset {
                    decimals
                  }
                  ...AssetQuantity_data
                }
              }
            }
          }
        }
      }
    `,
  },
})
