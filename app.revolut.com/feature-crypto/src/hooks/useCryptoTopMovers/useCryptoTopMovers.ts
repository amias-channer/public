import { Big } from 'big.js'
import { uniqBy, isEmpty } from 'lodash'

import { useGetInstrumentTopMovers, useQueryQuotes } from '@revolut/rwa-core-api'
import {
  InstrumentAssetType,
  MoneyDto,
  Currency,
  InstrumentTopMoversItem,
  InstrumentTopMoversResponseDto,
} from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'
import { getConfigValue, ConfigKey, CurrencyProperties } from '@revolut/rwa-core-config'
import { TopMoversTimeSpan } from '@revolut/rwa-core-types'

import { cropDecimalPart } from '../../utils'
import { useCryptoTargetCurrency } from '../useCryptoTargetCurrency'

import { TopMoverType } from './types'

const DEFAULT_CURRENCY = 'USD'

type CryptoTopMover = {
  name: string
  cryptoCode: string
  currentPriceInTargetCurrency: MoneyDto
  growthIndex: number
}

type UseCryptoTopMoversHookOptions = {
  moverType?: TopMoverType
  timeSpan?: TopMoversTimeSpan
}

type UseCryptoTopMoversHook = (
  options?: UseCryptoTopMoversHookOptions,
) => CryptoTopMover[] | null

const getAllUniqMovers = (
  topGainers?: InstrumentTopMoversItem[],
  topLosers?: InstrumentTopMoversItem[],
) => {
  const gainers = topGainers ?? []
  const losers = topLosers ?? []

  return uniqBy([...gainers, ...losers], (mover) => mover.symbol)
}

const getCryptosToFetchRates = (
  allMovers?: InstrumentTopMoversItem[],
  targetCurrency?: Currency,
) => {
  if (!allMovers || !targetCurrency) {
    return []
  }

  const ratesQuery = allMovers.map((mover) => `${mover.symbol}/${DEFAULT_CURRENCY}`)

  if (targetCurrency !== DEFAULT_CURRENCY && !isEmpty(ratesQuery)) {
    ratesQuery.push(`${DEFAULT_CURRENCY}${targetCurrency}`)
  }
  return ratesQuery
}

const getTopMoversByType = (
  moverTypes: TopMoverType,
  topMoversData?: InstrumentTopMoversResponseDto,
) => {
  if (!topMoversData) {
    return []
  }

  switch (moverTypes) {
    case TopMoverType.Gainers:
      return topMoversData?.topGainers ?? []
    case TopMoverType.Losers:
      return topMoversData?.topLosers ?? []
    default:
      return getAllUniqMovers(topMoversData?.topGainers, topMoversData?.topLosers)
  }
}

export const useCryptoTopMovers: UseCryptoTopMoversHook = ({
  moverType = TopMoverType.All,
  timeSpan = TopMoversTimeSpan.OneDay,
} = {}) => {
  const { topMoversData, isSuccess: topMoversRequestSuccess } = useGetInstrumentTopMovers(
    {
      assetType: InstrumentAssetType.Crypto,
      timeSpan,
    },
  )

  const { targetCurrency } = useCryptoTargetCurrency()

  const movers = getTopMoversByType(moverType, topMoversData)

  const {
    getRate,
    convert,
    status: ratesQueryStatus,
  } = useQueryQuotes(getCryptosToFetchRates(movers, targetCurrency))

  const cryptoCurrenciesInfo = getConfigValue(ConfigKey.CryptoCurrencies)

  if (!topMoversRequestSuccess || ratesQueryStatus !== 'success') {
    return null
  }

  const topMovers: CryptoTopMover[] = movers.map((mover) => {
    const currencyInfo: CurrencyProperties = cryptoCurrenciesInfo[mover.symbol]
    const { amount: baseAmount } = mover.basePrice

    const currentRate = checkRequired(
      getRate(mover.symbol, DEFAULT_CURRENCY)?.rate,
      `Rate for ${mover.symbol}/${DEFAULT_CURRENCY} should be defined`,
    )

    const growthIndex = cropDecimalPart(
      Big(currentRate).mul(100).div(baseAmount).minus(1).toNumber(),
      4,
    )

    const priceInTargetCurrency = convert(currentRate, targetCurrency, DEFAULT_CURRENCY)

    return {
      name: currencyInfo.currency,
      cryptoCode: mover.symbol,
      currentPriceInTargetCurrency: {
        amount: Big(priceInTargetCurrency).mul(100).toNumber(),
        currency: targetCurrency,
      },
      growthIndex,
    }
  })

  return topMovers
}
