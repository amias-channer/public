import { ExchangeMetadata } from "opensea-js/lib/types"
import { Token } from "../../../reducers/tokens"
import { getTrackingFn, getUnnamedTrackingFn } from "../utils"

type TransactionEventParams = {
  transactionHash?: string
}
export const trackCreateTransaction =
  getTrackingFn<TransactionEventParams>("create transaction")
export const trackTransactionFailed =
  getTrackingFn<TransactionEventParams>("transaction fail")
export const trackInitializeProxy = getTrackingFn("initialize proxy")

type WethEventParams = {
  amount?: number
}
export const trackUnwrapWeth = getTrackingFn<WethEventParams>("unwrap weth")
export const trackWrapWeth = getTrackingFn<WethEventParams>("wrap weth")
export const trackApproveCurrency = getTrackingFn<{
  paymentTokenAddress?: string
}>("approve currency")
export const trackApproveAll = getTrackingFn<{
  tokenAddress?: string
  proxyAddress?: string
}>("approve all")
export const trackApproveAsset = getTrackingFn<{
  tokenAddress?: string
  proxyAddress?: string
  tokenId?: string
}>("approve asset")
export const trackTransferAll = getTrackingFn<{
  toAddress?: string
}>("transfer all")

type TrackNotEnoughBalanceModalParams = {
  source?: "wrap-eth"
  amountInEth?: number
  missingToken?: Token
  transactionValue?: number
}
export const trackOpenNotEnoughBalanceModal =
  getTrackingFn<TrackNotEnoughBalanceModalParams>(
    "open not enough balance modal",
  )
export const trackApproveSellOrder = getTrackingFn("approve sell order")
export const trackCreateSellOrder = getTrackingFn("create sell order")
export const trackCancelSellOrder = getTrackingFn("cancel sell order")
export const trackApproveBuyOrder = getTrackingFn("approve buy order")
export const trackCreateBuyOrder = getTrackingFn("create buy order")
export const trackCancelBuyOrder = getTrackingFn("cancel buy order")
export const trackMatchOrdersBuying = getTrackingFn<{
  tokenSymbol?: string
  unitAmount?: number
  metadata?: ExchangeMetadata
}>("match orders buying")
export const trackMatchOrdersSelling = getTrackingFn<{
  tokenSymbol?: string
  unitAmount?: number
  metadata?: ExchangeMetadata
}>("match orders selling")

export type ExternalAuctionEventName =
  | "fulfill external auction"
  | "cancel external auction"
export const trackExternalAuctionEvent = getUnnamedTrackingFn<
  {
    url?: string
    target?: string
  },
  ExternalAuctionEventName
>()
