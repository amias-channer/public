import {
  convertCurrencyToMonetaryUnits,
  convertMonetaryToCurrencyUnits,
} from '@revolut/rwa-core-utils'
import { AssetsQuoteLimitDto, AssetsQuoteType } from '@revolut/rwa-core-types'

export const convertOptionalMonetaryToCurrencyUnits = (
  currency: string,
  amount?: number,
) => {
  if (!amount) {
    return undefined
  }

  return convertMonetaryToCurrencyUnits(currency, amount)
}

export const getCurrencyLimit = (
  assetsType: AssetsQuoteType,
  assetsQuoteLimits?: AssetsQuoteLimitDto,
) => {
  if (
    !assetsQuoteLimits ||
    !assetsQuoteLimits.converted ||
    assetsQuoteLimits.converted.assetType !== assetsType
  ) {
    return undefined
  }

  const limitValue = Number(assetsQuoteLimits.converted.value)

  if (assetsType === AssetsQuoteType.Fiat) {
    return convertCurrencyToMonetaryUnits(assetsQuoteLimits.converted.symbol, limitValue)
  }

  return limitValue
}
