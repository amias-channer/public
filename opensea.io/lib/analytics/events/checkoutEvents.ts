import { ChainIdentifier } from "../../../constants"
import { Token } from "../../../reducers/tokens"
import { getTrackingFn } from "../utils"

export const trackClickBuyNow =
  getTrackingFn<{ assetId: string }>("click buy now")
export const trackClickBuyWithCard = getTrackingFn<{ assetId: string }>(
  "click buy with card",
)

export const trackClickWyreAddFunds = getTrackingFn<{
  href: string
  token?: Token
}>("click wyre add funds")
export const trackOpenDepositModal =
  getTrackingFn<{ address: string; symbol: string }>("open deposit modal")

type MoonPayEventParams = {
  externalTransactionId: string
  symbol?: string
  chain?: ChainIdentifier
  fiatCurrency?: string
  fiatValue?: number
  widgetUrl?: string
}
export const trackOpenMoonPayModal =
  getTrackingFn<MoonPayEventParams>("open moonpay modal")
export const trackStartMoonPayTx = getTrackingFn<MoonPayEventParams>(
  "start moonpay transaction",
)
export const trackMoonPayTxFail = getTrackingFn<MoonPayEventParams>(
  "moonpay transaction fail",
)
export const trackMoonPayTxSuccess = getTrackingFn<MoonPayEventParams>(
  "moonpay transaction success",
)

export const trackOpenVerifyCollectionModal = getTrackingFn<{
  assetId: string
}>("open verify collection modal")
