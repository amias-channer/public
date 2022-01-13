import BigNumber from "bignumber.js"
import _ from "lodash"
import moment, { Moment } from "moment"
import { AUCTION_EVENT_TYPES } from "../constants"
import { bn } from "../lib/helpers/numberUtils"
import { Account, buildAccount } from "./accounts"
import { Asset, buildAsset } from "./assets"
import { Bundle, buildBundle } from "./bundles"
import { Token, buildToken } from "./tokens"
import { buildTransaction, Transaction } from "./transactions"

export interface Event {
  id: number
  eventType: string
  customEventName?: string
  auctionType: string
  quantity?: BigNumber
  timestamp: Moment
  createdDate: Moment
  transaction?: Transaction
  winnerAccount?: Account
  sellerAccount?: Account
  toAccount?: Account
  fromAccount?: Account
  ownerAccount?: Account
  approvedAccount?: Account
  paymentToken: Token
  devFeePaymentEvent?: Event
  collectionSlug: string
  contractAddress: string
  duration?: BigNumber
  totalPrice?: BigNumber
  totalPriceEth?: BigNumber
  totalPriceTotalQuantity?: BigNumber
  startingPrice?: BigNumber
  endingPrice?: BigNumber
  bidAmount?: BigNumber
  asset?: Asset
  assetBundle?: Bundle
}

export interface EventSubscription {
  discordWebhook: string
  fromAccount?: string
  maker?: string
  ids: number[]
  eventTypes: AUCTION_EVENT_TYPES[]
}

export const buildEvent = (data: any): Event => {
  const paymentToken = buildToken(data["payment_token"])
  const assetBundle =
    data["asset_bundle"] && typeof data["asset_bundle"] === "object"
      ? buildBundle(data["asset_bundle"])
      : undefined
  const event: Event = {
    id: data["id"],
    eventType: data["event_type"],
    customEventName: data["custom_event_name"],
    auctionType: data["auction_type"],
    quantity: data["quantity"] == null ? undefined : bn(data["quantity"]),
    timestamp: moment.unix(data["timestamp"]),
    createdDate: moment.utc(data["created_date"]),
    transaction: data["transaction"] && buildTransaction(data["transaction"]),
    winnerAccount:
      data["winner_account"] && buildAccount(data["winner_account"]),
    sellerAccount: data["seller"] && buildAccount(data["seller"]),
    toAccount: data["to_account"] && buildAccount(data["to_account"]),
    fromAccount: data["from_account"] && buildAccount(data["from_account"]),
    ownerAccount: data["owner_account"] && buildAccount(data["owner_account"]),
    approvedAccount:
      data["approved_account"] && buildAccount(data["approved_account"]),
    paymentToken,
    devFeePaymentEvent:
      data["dev_fee_payment_event"] &&
      buildEvent(data["dev_fee_payment_event"]),
    collectionSlug: data["collection_slug"],

    // Auctions
    contractAddress: data["contract_address"],
    duration: data["duration"] == null ? undefined : bn(data["duration"]),

    asset:
      data["asset"] && typeof data["asset"] === "object"
        ? buildAsset(data["asset"])
        : undefined,
    assetBundle: assetBundle,
  }

  const quantity = event.quantity || bn(1)

  return {
    ...event,
    ...pricesPerUnit({
      paymentToken,
      unitQuantity:
        event.asset && event.asset.decimals != null
          ? bn(quantity, event.asset.decimals)
          : assetBundle
          ? bn(1)
          : quantity,
      data,
    }),
  }
}

const pricesPerUnit = ({
  paymentToken,
  unitQuantity,
  data,
}: {
  paymentToken: Token
  unitQuantity: BigNumber
  data: any
}): Pick<
  Event,
  | "totalPriceTotalQuantity"
  | "totalPrice"
  | "totalPriceEth"
  | "startingPrice"
  | "endingPrice"
  | "bidAmount"
> => {
  let totalPriceTotalQuantity
  let totalPrice
  let totalPriceEth
  if (data["total_price"] != null) {
    totalPriceTotalQuantity = bn(data["total_price"], paymentToken.decimals)
    totalPrice = totalPriceTotalQuantity.dividedBy(unitQuantity)
    totalPriceEth = paymentToken.ethPrice
      ? totalPrice.times(paymentToken.ethPrice)
      : undefined
  }
  const normalize = (key: string): BigNumber | undefined =>
    data[key] == null
      ? undefined
      : bn(data[key], paymentToken.decimals).dividedBy(unitQuantity)
  return {
    totalPriceTotalQuantity,
    totalPrice,
    totalPriceEth,
    startingPrice: normalize("starting_price"),
    endingPrice: normalize("ending_price"),
    bidAmount: normalize("bid_amount"),
  }
}

export const buildEventSubscriptions = (data: any): EventSubscription[] => {
  const groups = _.groupBy(data, d => d.discord_webhook)
  return Object.entries(groups).map(([discord_webhook, settings]) => {
    return {
      discordWebhook: discord_webhook,
      fromAccount: settings
        .filter(s => s.from_account)
        .map(s => s.from_account.address)[0],
      maker: settings[0].maker,
      ids: settings.map(s => s.id),
      eventTypes: settings.map(s => s.event_type),
    }
  })
}
