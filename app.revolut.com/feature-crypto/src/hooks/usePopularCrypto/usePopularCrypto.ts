import { isEmpty } from 'lodash'
import { Big } from 'big.js'
import * as Sentry from '@sentry/react'

import {
  usePopularAssets,
  useQueryQuotes,
  useQueryVolatilityQuotes,
} from '@revolut/rwa-core-api'
import { InstrumentMostOwnedKey, MoneyDto } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'
import { getConfigValue, ConfigKey, CurrencyProperties } from '@revolut/rwa-core-config'

import { useCryptoTargetCurrency } from '../useCryptoTargetCurrency'

type PopularCrypto = {
  name: string
  cryptoCode: string
  currentPriceInTargetCurrency: MoneyDto
  volatility?: number
}

type UsePopularCryptoHook = () => PopularCrypto[]

export const usePopularCrypto: UsePopularCryptoHook = () => {
  const { targetCurrency } = useCryptoTargetCurrency()
  const { assets } = usePopularAssets(InstrumentMostOwnedKey.MostOwnedCrypto)

  const requestRates = assets.map((asset) => `${asset.symbol}/${targetCurrency}`)
  const { getRate, status: ratesStatus } = useQueryQuotes(requestRates)
  const { getVolatilityObject, status: volatilityStatus } =
    useQueryVolatilityQuotes(requestRates)

  if (isEmpty(assets) || ratesStatus !== 'success' || volatilityStatus !== 'success') {
    return []
  }

  const cryptoCurrenciesInfo = getConfigValue(ConfigKey.CryptoCurrencies)

  const popularCrypto = assets.map((asset) => {
    const currencyInfo: CurrencyProperties = cryptoCurrenciesInfo[asset.symbol]
    const currentRate = checkRequired(
      getRate(asset.symbol, targetCurrency)?.rate,
      `Rate for ${asset.symbol}/${targetCurrency} should be defined`,
    )

    const volatility = getVolatilityObject(asset.symbol, targetCurrency)?.volatility
    if (!volatility) {
      Sentry.captureException(
        new Error(`Volatility for ${asset.symbol}/${targetCurrency} is undefined`),
      )
    }

    return {
      name: currencyInfo.currency,
      cryptoCode: asset.symbol,
      currentPriceInTargetCurrency: {
        amount: Big(currentRate).mul(100).toNumber(),
        currency: targetCurrency,
      },
      volatility: volatility ? volatility / 100 : undefined,
    }
  })

  return popularCrypto
}
