import moment from "moment"
import ErrorActions from "../../actions/errors"
import { SEO_MAX_DESC_LENGTH, IS_PRODUCTION } from "../../constants"
import { Asset } from "../../reducers/assets"
import { Bundle } from "../../reducers/bundles"
import { dispatch } from "../../store"
import { ETHEREMON_TRADE_AUCTION_CONFIG } from "../contracts"
import { assetsVisitorUpdateMutation } from "../graphql/__generated__/assetsVisitorUpdateMutation.graphql"
import { graphql, mutateGlobal } from "../graphql/graphql"
import { makeBigNumber } from "../wyvern"
import { addressesEqual } from "./addresses"
import { stripHtml } from "./html"
import { normalizePriceDisplay } from "./numberUtils"
import { largeFrozenImage } from "./urls"

// TODO alex/joshua kill this file, replace with new helpers

/**
 * Sort an array of assets by their market demand
 * Returns an array for chaining, e.g.
 *  _.sortBy(bundle.assets, [
 *    a => a.assetContract.name,
 *    ...sortByDemand()
 *  ])
 */
export function sortByDemand() {
  const sorters = [
    (a: Required<Asset>) => (a.lastSale ? +a.lastSale.totalPriceEth * -1 : 0),
    (a: Required<Asset>) =>
      a.primaryBuyOrder?.currentPriceEth
        ? +a.primaryBuyOrder.currentPriceEth * -1
        : 0,
    (a: Required<Asset>) => +a.tokenId,
  ]
  return sorters
}

// TODO
export const bundlePageMetadata = (bundle: Bundle) => {
  const price = bundle.primarySellOrder?.currentPrice
    ? normalizePriceDisplay(bundle.primarySellOrder.currentPrice)
    : null
  const bid = bundle.primaryBuyOrder?.currentPrice
    ? normalizePriceDisplay(bundle.primaryBuyOrder.currentPrice)
    : null

  const strippedDescription = bundle.description
    ? stripHtml(bundle.description)
    : ""

  const title = `Bundle of ${bundle.assets?.length} Items: "${bundle.name}" | OpenSea`

  let desc = ""
  if (price) {
    desc +=
      "Currently " +
      price +
      ` ${bundle.primarySellOrder?.paymentTokenContract.symbol}: `
  } else if (bid) {
    desc +=
      "Top bid of " +
      bid +
      ` ${bundle.primaryBuyOrder?.paymentTokenContract.symbol}: `
  }
  if (strippedDescription) {
    desc += `"${strippedDescription.substring(0, SEO_MAX_DESC_LENGTH - 3)}..."`
  } else {
    desc += "View on OpenSea"
  }

  const image =
    bundle.imageUrlStatic ||
    (bundle.assetContract ? bundle.assetContract.imageUrl : null)

  return { title, desc, image }
}

export const assetPageMetadata = (asset: Asset) => {
  const { displayPrice, price, paymentTokenContract } =
    getSaleDisplayAttributes(asset)

  const bid = asset.primaryBuyOrder?.currentPrice
    ? normalizePriceDisplay(asset.primaryBuyOrder.currentPrice)
    : null
  const strippedDescription = stripHtml(
    asset.description || asset.assetContract?.description,
  )
  const token =
    paymentTokenContract || asset.primaryBuyOrder?.paymentTokenContract
  const tokenSymbol = token ? token.symbol : "ETH"
  const isNamed = asset.name && asset.name != asset.nameDefault

  let title = `${
    isNamed ? asset.name + " - " + asset.tokenName : asset.nameDefault
  } |`

  const fiatPrice =
    token && token.usdPrice && price
      ? makeBigNumber(price).times(token.usdPrice).toFixed(2)
      : undefined

  // TODO
  if (asset.defaultToFiat && fiatPrice) {
    title += ` currently $${fiatPrice} on`
  } else if (displayPrice) {
    title += ` currently ${displayPrice} ${tokenSymbol} on`
  } else if (bid) {
    title += ` current bid of ${bid} ${tokenSymbol} on`
  }
  title += ` OpenSea`

  const desc =
    `${isNamed ? asset.name + " is " : ""}${asset.nameDefault}: ${
      strippedDescription || "View asset history"
    }`.substring(0, SEO_MAX_DESC_LENGTH - 3) + "..."

  const image =
    asset?.imageUrlStatic && asset?.imageUrl?.endsWith(".svg")
      ? largeFrozenImage(asset.imageUrlStatic)
      : asset?.imageUrl
      ? largeFrozenImage(asset.imageUrl)
      : asset.collection?.imageUrl

  return { title, desc, image }
}

// TODO move this to the reducers
export const getSaleDisplayAttributes = (asset: Asset | Bundle) => {
  const {
    auction,
    primarySellOrder,
    maxValidBid,
    validBids,
    buyOrders,
    ownerAccount,
  } = asset as Asset
  const { makerAccount } = asset as Bundle

  const onSale = !!auction || !!primarySellOrder
  const isEnglishAuction =
    primarySellOrder && primarySellOrder.waitingForBestCounterOrder
  const hasOffers = buyOrders && buyOrders.length > 0

  // TODO is this needed to get base units right?
  // const orderToPrice = (order, useEndPrice = false) => {
  //   if (decimals) {
  //     return makeBigNumber(order.currentPrice).dividedBy(bn(order.quantity, asset.decimals))
  //   }
  //   return useEndPrice ? order.endPrice : order.currentPrice
  // }

  const price = primarySellOrder
    ? isEnglishAuction && maxValidBid
      ? maxValidBid.currentPrice
      : primarySellOrder.currentPrice
    : auction
    ? auction.currentPrice
    : undefined

  const displayPrice = price != null ? normalizePriceDisplay(price) : undefined

  const endPrice = primarySellOrder
    ? !isEnglishAuction
      ? normalizePriceDisplay(primarySellOrder.endPrice)
      : undefined
    : auction && auction.endingPrice
    ? normalizePriceDisplay(auction.endingPrice)
    : undefined

  const startTime = primarySellOrder
    ? moment(primarySellOrder.createdDate).local()
    : auction && auction.startedAt
    ? moment.unix(+auction.startedAt).local()
    : undefined

  const endTime = primarySellOrder
    ? primarySellOrder.closingDate
      ? moment(primarySellOrder.closingDate).local()
      : primarySellOrder && +primarySellOrder.expirationTime
      ? moment.unix(+primarySellOrder.expirationTime).local()
      : undefined
    : auction && auction.duration && auction.startedAt
    ? moment
        .unix(+auction.startedAt)
        .local()
        .add(+auction.duration, "seconds")
    : undefined

  const cancellable = primarySellOrder
    ? true
    : auction
    ? (auction as unknown) !== "unsupported" &&
      !addressesEqual(
        auction.auctionContractAddress,
        ETHEREMON_TRADE_AUCTION_CONFIG.ethereum,
      ) &&
      !auction.transactionData
    : false

  const isExpired =
    primarySellOrder && endTime && endTime.diff(moment().local()) <= 0
  const isExpiredAuction =
    auction && endTime && endTime.diff(moment().local()) <= 0

  const remainingTime =
    endTime && !isExpired && !isExpiredAuction
      ? moment.duration(endTime.diff(moment().local()))
      : null

  const paymentTokenContract =
    primarySellOrder?.paymentTokenContract || auction?.paymentTokenContract

  const _currentPriceBN =
    isEnglishAuction && maxValidBid && maxValidBid.currentPrice
      ? makeBigNumber(maxValidBid.currentPrice)
      : primarySellOrder &&
        primarySellOrder.currentPrice &&
        +primarySellOrder.currentPrice > 0
      ? makeBigNumber(primarySellOrder.currentPrice)
      : null

  const referralBonus =
    _currentPriceBN &&
    primarySellOrder &&
    primarySellOrder.bountyMultiple &&
    +primarySellOrder.bountyMultiple > 0
      ? normalizePriceDisplay(
          _currentPriceBN.times(primarySellOrder.bountyMultiple),
          6,
        )
      : null

  return {
    onSale,
    hasOffers,
    owner: auction // Might not have an auction
      ? auction.sellerAccount.address
      : ownerAccount // Might not have a single owner, if bundle
      ? ownerAccount.address
      : makerAccount // Might not have a maker, if asset
      ? makerAccount.address
      : asset.owner, // fallback
    price,
    displayPrice,
    startTime,
    endTime,
    remainingTime,
    isExpired,
    endPrice,
    cancellable,
    referralBonus,
    paymentTokenContract,
    isEnglishAuction,
    validBids,
  }
}

export const reportAssetVisitor = async (relayId: string) => {
  try {
    await mutateGlobal<assetsVisitorUpdateMutation>(
      graphql`
        mutation assetsVisitorUpdateMutation($asset: AssetRelayID!) {
          assets {
            createAssetVisitor(asset: $asset)
          }
        }
      `,
      {
        asset: relayId,
      },
    )
  } catch (error) {
    if (IS_PRODUCTION) {
      return
    }
    dispatch(
      ErrorActions.show(
        error,
        `Error requesting GraphQL API: ${error.message}`,
      ),
    )
  }
}
