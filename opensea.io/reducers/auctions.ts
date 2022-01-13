import BigNumber from "bignumber.js"
import _ from "lodash"
import moment, { Moment } from "moment"
import { orderFromJSON } from "opensea-js"
import {
  Order,
  WyvernSchemaName,
  OpenSeaFungibleToken,
} from "opensea-js/lib/types"
import { AnyAction } from "redux"
import { NULL_ACCOUNT } from "../constants"
import { isOpenSeaAuction } from "../lib/contracts"
import { bn } from "../lib/helpers/numberUtils"
import { OrderSide, canMatchOrders, computeCurrentPrice } from "../lib/wyvern"
import { Account, buildAccount } from "./accounts"
import { buildAsset, Asset, AssetOwnership } from "./assets"
import { buildBundle, Bundle } from "./bundles"
import { Category } from "./categories"
import { buildToken, Token } from "./tokens"

interface CachedOrder {
  // TODO @alex add an OrderBookOrder type to SDK and have ExtendedOrder extend it,
  // so that currentPrice can be required here
  currentPrice?: BigNumber
  currentPriceEth?: BigNumber
  currentTotalPrice: BigNumber
  paymentToken: string
  paymentTokenContract: OpenSeaFungibleToken
  expirationTime: BigNumber
  listingTime: BigNumber
  waitingForBestCounterOrder: boolean
  isBundle?: boolean
}

export interface ExtendedOrder extends Order, CachedOrder {
  // Require these
  makerAccount: any
  takerAccount: any
  paymentTokenContract: Token
  feeRecipientAccount: any

  isExpired: boolean
  isPrivate: boolean
  isApproved: boolean
  createdDate: Moment
  closingDate?: Moment
  closingExtendable: boolean

  endPrice: BigNumber
  bountyMultiple: BigNumber

  // Min ratio of next counterorder to previous counterorder
  minCounterOrderRatio?: number
  minCounterOrder: BigNumber

  _isHighestBid?: boolean
  _isLowestPrice?: boolean

  assetOrBundle?: Tradeable
}

export interface ExtendedOrderMetadata {
  highestBuyOrder?: CachedOrder
  lowestSellOrder?: CachedOrder
  lastBundleSellOrder?: CachedOrder
}

export interface BidderCommitment {
  maker: Account
  paymentToken: Token
  balance: BigNumber
  commitment: BigNumber
  winningBid: ExtendedOrder
}

export interface Tradeable {
  listingsEnabled?: boolean
  orders?: ExtendedOrder[]
  // Sorted by currentPriceEth, descending:
  buyOrders?: ExtendedOrder[]
  // Sorted by currentPriceEth, ascending:
  sellOrders?: ExtendedOrder[]

  // Main sell order to show
  primarySellOrder?: ExtendedOrder
  // Lowest private order, or lowest non-auction order
  secondarySellOrder?: ExtendedOrder

  primaryBuyOrder?: ExtendedOrder
  highestBuyerCommitment?: BidderCommitment
  topBidAmount?: BigNumber
  schemaName?: WyvernSchemaName
  // English Auctions
  maxValidBid?: ExtendedOrder
  validBids?: ExtendedOrder[]

  isTransferrableToOwner?: boolean
  isTransferrableByOwner?: boolean

  isFungible?: boolean
  isSemiFungible?: boolean
  isNonFungible?: boolean
  useFungibleLayout?: boolean

  defaultToFiat?: boolean

  assetContract?: Category
  collection?: Category
  ownerAccount?: any
  name?: string
  nameDefault?: string
  nameShort?: string
  description?: string
  externalLink?: string
  twitterHandle?: string
  instagramHandle?: string
  link?: string
  openseaLink?: string

  imageUrlStatic?: string
  backgroundColor?: string

  transferFeeToken?: Token
  transferFee?: BigNumber
}

interface TransactionData {
  data: string
  to: string
  value: BigNumber
}

export interface EscrowAuction {
  sellerAccount: any
  auctionContractAddress: string
  externalLink?: string
  startedAt: BigNumber
  duration: BigNumber
  currentPrice: BigNumber
  startingPrice: BigNumber
  endingPrice: BigNumber
  referralBonus: BigNumber
  paymentToken: string
  paymentTokenContract: Token
  asset?: Asset
  transactionData?: TransactionData
}

const AuctionsReducer = (state = {}, action: AnyAction) => {
  switch (action.type) {
    default:
      return state
  }
}

export const buildBidderCommitment = (
  commitmentData: any,
): BidderCommitment | undefined => {
  if (!commitmentData) {
    return undefined
  }
  const paymentToken = buildToken(commitmentData["payment_token"])
  return {
    maker: buildAccount(commitmentData["maker"]),
    paymentToken,
    balance: bn(commitmentData["balance"], paymentToken.decimals),
    commitment: bn(commitmentData["commitment"], paymentToken.decimals),
    winningBid: buildOrder(commitmentData["winning_bid"]),
  }
}

const buildTransactionData = (data: any): TransactionData | undefined =>
  data &&
  data["to"] && {
    data: data["data"],
    to: data["to"],
    value: data["value"] ? bn(data["value"]) : bn(0),
  }

/**
 * Build an auction from server JSON
 * @param auctionData JSON from API about the auction
 * @param includeAsset whether to build an asset inside
 */
export function buildAuction(
  auctionData: any,
  includeAsset = false,
): EscrowAuction {
  const token = buildToken(auctionData["payment_token"])
  const currentPrice =
    auctionData["current_price"] != null
      ? bn(auctionData["current_price"], token.decimals)
      : computeCurrentPriceAuction(auctionData)
  const startingPrice = bn(auctionData["starting_price"], token.decimals)
  const endingPrice = bn(auctionData["ending_price"], token.decimals)
  const isOpenSea = isOpenSeaAuction(auctionData["auction_contract_address"])
  return {
    auctionContractAddress: auctionData["auction_contract_address"],
    sellerAccount: buildAccount(auctionData["seller"]),
    duration: bn(auctionData["duration"]),
    startedAt: bn(auctionData["started_at"]),
    externalLink: auctionData["external_link"],
    currentPrice,
    startingPrice,
    endingPrice,
    referralBonus: isOpenSea ? currentPrice.dividedBy(100) : bn(0),
    paymentToken: token.address,
    paymentTokenContract: token,
    asset:
      includeAsset && auctionData["asset"]
        ? buildAsset(auctionData["asset"])
        : undefined,
    transactionData: buildTransactionData(auctionData["transaction_data"]),
  }
}

/**
 * Gets the price for the API data or cached auction passed in
 * @param auctionData API data about auction
 * @param cachedAuction Store auction object
 */
export function computeCurrentPriceAuction(
  auctionData: any,
  cachedAuction: any = null,
): BigNumber {
  let { started_at, duration, starting_price, ending_price } =
    auctionData || ({} as any)
  if (cachedAuction) {
    // Reverse the reducer
    started_at = cachedAuction.startedAt
    duration = cachedAuction.duration
    starting_price = cachedAuction.startingPrice
    ending_price = cachedAuction.endingPrice
  }
  const now = moment().unix()
  const age = now - started_at
  const percentDone = bn(age / duration)
  const startPrice = bn(starting_price)
  const endPrice = bn(ending_price)

  const currentPriceDuringAuction = endPrice
    .minus(startPrice)
    .times(percentDone)
    .plus(startPrice)

  return age < duration ? currentPriceDuringAuction : endPrice
}

interface OrderbookOrder extends Order {
  currentPrice: BigNumber
}

/**
 * Build an ExtendedOrder from server JSON
 * @param orderData JSON for order
 */
export function buildOrder(orderData: any): ExtendedOrder {
  const order = orderFromJSON(orderData) as OrderbookOrder
  const token = buildToken(orderData["payment_token_contract"])
  const isExpired =
    +order.expirationTime > 0 &&
    moment.unix(+order.expirationTime).diff(moment()) <= 0
  const isPrivate = order.taker != NULL_ACCOUNT
  const isSigned = !!(order.s && order.r && order.v)
  const { currentPrice, currentPriceEth, currentTotalPrice, endPrice } =
    getOrderPrices(order, true)
  return {
    ...order,
    isExpired,
    isPrivate,
    isApproved: !!orderData.approved_on_chain || isSigned,
    closingDate: orderData.closing_date
      ? moment.utc(orderData.closing_date)
      : undefined,
    closingExtendable: !!orderData.closing_extendable,
    createdDate: moment.utc(orderData.created_date),
    makerAccount: order.makerAccount ? buildAccount(order.makerAccount) : {},
    takerAccount: order.takerAccount ? buildAccount(order.takerAccount) : {},
    feeRecipientAccount: order.feeRecipientAccount
      ? buildAccount(order.feeRecipientAccount)
      : {},
    paymentTokenContract: token,

    endPrice,
    currentPrice,
    currentPriceEth,
    currentTotalPrice,
    bountyMultiple: bn(orderData.bounty_multiple),
    // When English Auction
    minCounterOrderRatio: order.waitingForBestCounterOrder ? 1.05 : undefined,
    minCounterOrder: order.waitingForBestCounterOrder ? currentPrice : bn(0),
    // Fix SSR bignumber issues
    salt: bn(orderData.salt),
    // Asset/bundle metadata
    assetOrBundle: orderData.asset
      ? buildAsset(orderData.asset)
      : orderData.asset_bundle
      ? buildBundle(orderData.asset_bundle)
      : undefined,
  }
}

/**
 * Compute the prices within an order
 * @param order Order to get price info
 */
export function getOrderPrices(order: OrderbookOrder, forceEstimate = false) {
  const baseUnitQuantity = order.quantity
  const currentTotalPrice = forceEstimate
    ? bn(computeCurrentPrice(order), order.paymentTokenContract?.decimals)
    : bn(order.currentPrice, order.paymentTokenContract?.decimals)
  // NOTE: not in units! can't know without asset decimals on order
  const currentPrice = currentTotalPrice.dividedBy(baseUnitQuantity)
  const currentPriceEth = order.paymentTokenContract?.ethPrice
    ? currentPrice.times(order.paymentTokenContract.ethPrice)
    : undefined
  const endPrice = bn(
    bn(order.basePrice).minus(order.extra),
    order.paymentTokenContract?.decimals,
  ).dividedBy(baseUnitQuantity)
  return {
    currentPrice,
    currentPriceEth,
    currentTotalPrice,
    endPrice,
  }
}

/**
 * Set `buyOrders`, `sellOrders`, `primaryBuyOrder`, `primarySellOrder`, and `secondarySellOrder`
 * @param assetOrBundle Partially-made asset or bundle to format orders for
 * @param data server JSON for the previous arg
 */
export function formatOrders(
  assetOrBundle: Asset | Bundle,
  data: any,
  shouldFormatOwnerships = false,
) {
  if (!assetOrBundle.orders) {
    assetOrBundle.orders = data.orders ? data.orders.map(buildOrder) : []
  }

  const orders = assetOrBundle.orders as ExtendedOrder[]

  assetOrBundle.buyOrders = _(orders)
    .filter(isOrderOpen)
    .filter(o => o.side == OrderSide.Buy)
    .sortBy([o => o.currentPriceEth && +o.currentPriceEth * -1])
    .value()

  assetOrBundle.sellOrders = _(orders)
    .filter(isOrderOpen)
    .filter(o => o.side == OrderSide.Sell)
    .sortBy([o => o.currentPriceEth && +o.currentPriceEth])
    .value()

  const primaryBuyOrder = assetOrBundle.buyOrders[0]
  if (primaryBuyOrder) {
    primaryBuyOrder["_isHighestBid"] = true
    assetOrBundle.primaryBuyOrder = primaryBuyOrder
  }

  const primarySellOrder = assetOrBundle.sellOrders[0]
  if (primarySellOrder) {
    primarySellOrder["_isLowestPrice"] = true
    assetOrBundle.primarySellOrder = primarySellOrder
  }

  // Set English auctions' Buy Now prices
  if (
    assetOrBundle.primarySellOrder &&
    assetOrBundle.primarySellOrder.waitingForBestCounterOrder
  ) {
    const nonEnglishSellOrders = assetOrBundle.sellOrders.filter(
      o => !o.waitingForBestCounterOrder,
    )
    assetOrBundle.secondarySellOrder = _.minBy(
      nonEnglishSellOrders,
      o => o.currentPriceEth && +o.currentPriceEth,
    )
    // Don't allow Nifty Gateway
    assetOrBundle.defaultToFiat = false
  }

  // Swap with the lowest non-private sell order when lowest is private
  if (
    assetOrBundle.primarySellOrder &&
    assetOrBundle.primarySellOrder.isPrivate
  ) {
    const publicSellOrders = assetOrBundle.sellOrders.filter(o => !o.isPrivate)
    const minPublicOrder = _.minBy(
      publicSellOrders,
      o => o.currentPriceEth && +o.currentPriceEth,
    )
    if (minPublicOrder) {
      assetOrBundle.secondarySellOrder = assetOrBundle.primarySellOrder
      assetOrBundle.primarySellOrder = minPublicOrder
    }
    // Don't allow Nifty Gateway
    assetOrBundle.defaultToFiat = false
  }

  if (
    assetOrBundle.primarySellOrder &&
    (assetOrBundle.primarySellOrder as any).isBundle
  ) {
    // Don't allow Nifty Gateway on bundles
    assetOrBundle.defaultToFiat = false
  }

  // For English auctions
  assetOrBundle.validBids = _(assetOrBundle.buyOrders)
    .filter(o => canMatchOrders(o, assetOrBundle.primarySellOrder))
    .sortBy(
      o => o.currentPriceEth && parseFloat(o.currentPriceEth.toString()) * -1,
    )
    .value()

  assetOrBundle.maxValidBid = assetOrBundle.validBids[0]

  assetOrBundle.schemaName = getAssetSchemaName(assetOrBundle)

  if (shouldFormatOwnerships) {
    formatOwnershipsWithSellOrders(assetOrBundle)
  }
}

function formatOwnershipsWithSellOrders(asset: Asset) {
  // Check o.maker in case Algolia has a bug and doesn't send it down
  const sellOrderMapping = _.groupBy(
    asset.sellOrders || [],
    o => o.maker && o.maker.toLowerCase(),
  )
  asset.allOwnerships = asset.allOwnerships || []
  const currentOwnerships = _(asset.allOwnerships).uniqBy(o => o.owner.address)

  // Create new ownerships from sell orders and ownerships
  let ownershipsWithSellOrders: AssetOwnership[] = []
  currentOwnerships.forEach(o => {
    const key = o.owner.address.toLowerCase()
    const sellOrders = sellOrderMapping[key]
    if (sellOrders) {
      ownershipsWithSellOrders = [
        ...ownershipsWithSellOrders,
        ...sellOrders.map(s => buildAssetOwnershipFromSellOrder(s, o.quantity)),
      ]
      delete sellOrderMapping[key]
    } else {
      ownershipsWithSellOrders.push(o)
    }
  })

  // For remaining sell orders, create non-quantity ownerships
  const sellOrdersMissingOwnershipQuantities = _(sellOrderMapping)
    .map(sells => sells.map(s => buildAssetOwnershipFromSellOrder(s)))
    .flatten()
    .value()

  asset.allOwnerships = [
    ...ownershipsWithSellOrders,
    ...sellOrdersMissingOwnershipQuantities,
  ]
}

/**
 * Make an asset ownership out of a sell order
 * @param sellOrder Sell order to construct an ownership from
 */
function buildAssetOwnershipFromSellOrder(
  sellOrder: ExtendedOrder,
  quantity?: BigNumber,
): AssetOwnership {
  return {
    owner: sellOrder.makerAccount,
    // Don't know the full quantity owned by the seller
    quantity,
    sellOrder,
  }
}

function isOrderOpen(order: ExtendedOrder) {
  return !order.markedInvalid && !order.cancelledOrFinalized && !order.isExpired
}

function getAssetSchemaName(asset: Asset | Bundle) {
  return asset.primarySellOrder?.metadata &&
    "schema" in asset.primarySellOrder.metadata
    ? asset.primarySellOrder.metadata.schema
    : asset.assetContract?.schemaName
}

export default AuctionsReducer
