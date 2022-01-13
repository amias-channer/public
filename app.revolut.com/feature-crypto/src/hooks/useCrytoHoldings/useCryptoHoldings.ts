import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'
import { Big } from 'big.js'
import * as Sentry from '@sentry/react'

import { QueryKey } from '@revolut/rwa-core-utils'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { useQueryWallet, useQueryQuotes } from '@revolut/rwa-core-api'
import { checkIfCryptoCurrency } from '@revolut/rwa-core-utils'
import {
  Currency,
  PocketState,
  PocketType,
  QuoteResponseDto,
  WalletDto,
} from '@revolut/rwa-core-types'
import { getConfigValue, ConfigKey, CurrencyProperties } from '@revolut/rwa-core-config'

import { fetchCryptoHoldings } from '../../api'
import { DEFAULT_TARGET_CURRENCY } from '../../constants'
import { cropDecimalPart } from '../../utils'

import { CryptoHoldingItem, AllCryptoHoldings } from './types'

export const REFECTH_RATES_INTERVAL = 3000

type LoadingStatus = {
  isLoading: boolean
}

type CryptoHolding = {
  value: CryptoHoldingItem | undefined
} & LoadingStatus

type UseCryptoHoldingsType = (targetCurrency?: Currency) => {
  getAllHoldings: () => AllCryptoHoldings & LoadingStatus
  getHolding: (cryptoCode: string) => CryptoHolding
}

const sumBigBy = <T>(objArray: T[], getItemValueFunc: (item: T) => number) => {
  return objArray
    .reduce((result, item) => {
      const itemValue = getItemValueFunc(item)
      return result.plus(itemValue)
    }, Big(0))
    .toNumber()
}

const getUserCryptos = (wallet?: WalletDto) => {
  if (!wallet) {
    return []
  }
  return wallet.pockets.filter(
    (pocket) =>
      checkIfCryptoCurrency(pocket.currency) &&
      pocket.state === PocketState.Active &&
      pocket.type === PocketType.Current &&
      pocket.balance > 0,
  )
}

const getRatesToQuery = (cryptoCodes: string[], targetCurrency: Currency) => {
  const ratesQuery = cryptoCodes.map((code) => `${code}/${targetCurrency}`)
  if (targetCurrency !== DEFAULT_TARGET_CURRENCY) {
    ratesQuery.push(`${DEFAULT_TARGET_CURRENCY}${targetCurrency}`)
  }
  return ratesQuery
}

const getRate = (
  rates: QuoteResponseDto[],
  fromCurrency: Currency,
  toCurrency: Currency,
) => {
  const foundRate = rates.find(
    (rate) => rate.from === fromCurrency && rate.to === toCurrency,
  )
  if (!foundRate) {
    throw new Error(`No rate info for ${fromCurrency}/${toCurrency}`)
  }
  return foundRate
}

const NO_CRYPTO_HOLDINGS = {
  totalInCurrency: 0,
  totalPerformance: 0,
  totalPnl: 0,
  items: [],
}

export const useCryptoHoldings: UseCryptoHoldingsType = (
  targetCurrency = DEFAULT_TARGET_CURRENCY,
) => {
  const { user } = useAuthContext()

  const { data: wallet, status: walletQueryStatus } = useQueryWallet()

  const allUserCryptos = getUserCryptos(wallet)

  const { data: rates, status: ratesQueryStatus } = useQueryQuotes(
    getRatesToQuery(
      allUserCryptos.map((crypto) => crypto.currency),
      targetCurrency,
    ),
    REFECTH_RATES_INTERVAL,
  )

  const { data: allCryptoHoldings, status: cryptosQueryStatus } = useQuery(
    QueryKey.CryptoHoldings,
    () => user && fetchCryptoHoldings(user.id),
    { enabled: !isEmpty(allUserCryptos) && Boolean(user) },
  )

  const cryptoCurrenciesInfo = getConfigValue(ConfigKey.CryptoCurrencies)

  const isLoading =
    cryptosQueryStatus === 'loading' ||
    !user ||
    walletQueryStatus === 'loading' ||
    ratesQueryStatus === 'loading'

  const defaultToTargetCurrencyRate =
    DEFAULT_TARGET_CURRENCY === targetCurrency || isLoading
      ? Big(1)
      : Big(getRate(rates, DEFAULT_TARGET_CURRENCY, targetCurrency).rate)

  const cryptoHoldings = allCryptoHoldings?.positions.filter(
    (position) => position.positionCurrency,
  )

  const cryptoHoldingItems: CryptoHoldingItem[] = useMemo(() => {
    if (isLoading || !cryptoHoldings) {
      return []
    }

    return allUserCryptos.map((cryptoPocket) => {
      const holdingInfo = cryptoHoldings.find(
        (holding) => holding.positionCurrency === cryptoPocket.currency,
      )

      const rateInfo = getRate(rates, cryptoPocket.currency, targetCurrency)

      const cryptoInfo: CurrencyProperties = cryptoCurrenciesInfo[cryptoPocket.currency]

      const quantity = Big(cryptoPocket.balance).div(Big(10).pow(cryptoInfo.fraction))

      const currentPrice = Big(rateInfo.rate).times(100).toNumber() // this one will be used to calc balances
      const trunckedCurrentPrice = Math.trunc(currentPrice) // this on will be used to calc pnls and %

      const totalPrice = Math.trunc(quantity.times(currentPrice).toNumber())

      if (!holdingInfo) {
        // Handling inconsistent backend state. When pocket with not nullable balance is present, but holding info is absent.
        Sentry.captureException(
          new Error(`No holding info for crypto ${cryptoPocket.currency}`),
        )

        return {
          code: cryptoPocket.currency,
          name: cryptoInfo.currency,
          amount: cryptoPocket.balance,
          state: cryptoPocket.state,
          quantity: quantity.toNumber(),
          fraction: cryptoInfo.fraction,
          pricePerOne: trunckedCurrentPrice,
          totalPrice,
        }
      }

      const averagePrice = Big(holdingInfo.averagePrice.amount)

      // Cause Android has low accuracy in pnl and performance calculations
      // (due to cropping of decimal part in rates for these operation)
      // we try to show the same numbers using trunc in rates.
      const averagePriceInTargetCurrency = Math.trunc(
        averagePrice.times(defaultToTargetCurrencyRate).toNumber(),
      )

      const pnl =
        averagePriceInTargetCurrency > 0
          ? cropDecimalPart(
              Big(trunckedCurrentPrice)
                .minus(averagePriceInTargetCurrency)
                .times(quantity)
                .toNumber(),
              4,
            )
          : undefined

      const growthIndex =
        averagePriceInTargetCurrency > 0
          ? cropDecimalPart(
              Big(trunckedCurrentPrice)
                .div(averagePriceInTargetCurrency)
                .minus(1)
                .toNumber(),
              4,
            )
          : undefined

      return {
        code: cryptoPocket.currency,
        name: cryptoInfo.currency,
        amount: cryptoPocket.balance,
        state: cryptoPocket.state,
        quantity: quantity.toNumber(),
        fraction: cryptoInfo.fraction,
        pricePerOne: trunckedCurrentPrice,
        pnl,
        averagePrice:
          averagePriceInTargetCurrency > 0 ? averagePriceInTargetCurrency : undefined,
        totalPrice,
        growthIndex,
      }
    })
  }, [
    allUserCryptos,
    cryptoCurrenciesInfo,
    cryptoHoldings,
    defaultToTargetCurrencyRate,
    isLoading,
    rates,
    targetCurrency,
  ])

  const getAllHoldings = () => {
    if (isLoading) {
      return {
        ...NO_CRYPTO_HOLDINGS,
        targetCurrency,
        isLoading: true,
      }
    }

    if (isEmpty(cryptoHoldingItems) || isEmpty(rates)) {
      return {
        ...NO_CRYPTO_HOLDINGS,
        targetCurrency,
        isLoading: false,
      }
    }

    const totalInCurrency = sumBigBy(cryptoHoldingItems, (item) => item.totalPrice)
    const totalPnl = sumBigBy(cryptoHoldingItems, (item) => item.pnl ?? 0)

    const notNullableHoldingItems = cryptoHoldingItems.filter((item) => item.averagePrice)
    const totalPerformance = isEmpty(notNullableHoldingItems)
      ? 0
      : Big(totalPnl)
          .div(
            sumBigBy(notNullableHoldingItems, (item) =>
              Big(item.quantity)
                .times(item.averagePrice as number)
                .toNumber(),
            ),
          )
          .toNumber()

    return {
      totalInCurrency: cropDecimalPart(totalInCurrency, 2),
      totalPerformance: cropDecimalPart(totalPerformance, 4),
      totalPnl: cropDecimalPart(totalPnl, 2),
      targetCurrency,
      items: cryptoHoldingItems,
      isLoading: false,
    }
  }

  const getHolding = (cryptoCode: string) => {
    if (isLoading) {
      return {
        isLoading: true,
        value: undefined,
      }
    }

    return {
      value: cryptoHoldingItems.find((item) => item.code === cryptoCode),
      isLoading: false,
    }
  }

  return {
    getAllHoldings,
    getHolding,
  }
}
