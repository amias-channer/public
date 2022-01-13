import {
  ChainIdentifier,
  MOONPAY_API_BASE_QS,
  MOONPAY_API_BASE_URL,
} from "../../../constants"

export const getMoonPayApiRetrieveExtTxUrl = (
  externalTransactionId: string,
) => {
  return `${MOONPAY_API_BASE_URL}/v1/transactions/ext/${externalTransactionId}?${MOONPAY_API_BASE_QS}`
}

export const getCurrencyCode = (symbol?: string, chain?: ChainIdentifier) => {
  if (!symbol) {
    return undefined
  }

  if (chain === "ETHEREUM") {
    return symbol
  } else if (chain === "MATIC") {
    // we only support ETH on Polygon right now
    return "eth_polygon"
  } else {
    // unset default selected token to avoid leading user to buy the token on the wrong chain
    return undefined
  }
}

const MOONPAY_FEE_PERCENTAGE = 0.045
export const padFiatValueWithFeeAmt = (fiatValue: number) => {
  const feeAmt = fiatValue * MOONPAY_FEE_PERCENTAGE
  return fiatValue + Math.max(feeAmt, 4)
}
