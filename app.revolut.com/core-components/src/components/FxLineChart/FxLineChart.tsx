import { useMemo, VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { first, isEmpty, last } from 'lodash'

import { useGetFxChartData, useQueryQuotes } from '@revolut/rwa-core-api'
import { useLocale } from '@revolut/rwa-core-i18n'
import {
  ExchangeRate,
  FxLineChartDataDto,
  FxLineChartPointDto,
  FxRange,
  QuoteRateSide,
} from '@revolut/rwa-core-types'
import {
  checkRequired,
  formatMoney,
  CurrencyDisplay,
  FxRangeIntervalMap,
  SignDisplay,
} from '@revolut/rwa-core-utils'

import { getChartTime } from '../../utils'
import {
  ChartTimeRange,
  PriceChart,
  PriceChartSkeleton,
  LightweightChartType,
} from '../PriceChart'
import { RatePerformance } from '../RatePerformance'
import { useFxLineChart } from './useFxLineChart'

const REFETCH_QUOTES_INTERVAL = 3_000

export const cropDecimalPart = (value: number, fractionDigits: number) =>
  parseFloat(value.toFixed(fractionDigits))

const getMoneyFormattingRules = (maximumFractionDigits: number) => ({
  withCurrency: true,
  useGrouping: true,
  noDecimal: false,
  signDisplay: SignDisplay.Auto,
  currencyDisplay: CurrencyDisplay.Symbol,
  minimumFractionDigits: 0,
  maximumFractionDigits,
})

type Props = {
  baseCurrency: string
  chartHeight?: number
  exchangeRate?: ExchangeRate
  currenciesPairSeparator?: string
  maximumFractionDigits: number
  note?: string
  reversed?: boolean
  targetCurrency: string
}

export const FxLineChart: VFC<Props> = ({
  baseCurrency,
  chartHeight,
  exchangeRate,
  currenciesPairSeparator = '',
  maximumFractionDigits,
  note,
  reversed,
  targetCurrency,
}) => {
  const { locale } = useLocale()
  const { t } = useTranslation('components.FxLineChart')

  const { currentTimeRange, visibleRange, onChartDataReceived, onTimeRangeChange } =
    useFxLineChart()

  const orderedCurrencyPair = reversed
    ? [targetCurrency, baseCurrency]
    : [baseCurrency, targetCurrency]

  const { fxChartData } = useGetFxChartData({
    currenciesPair: orderedCurrencyPair.join(currenciesPairSeparator),
    fxInterval: FxRangeIntervalMap[currentTimeRange],
    fxRange: currentTimeRange,
    onSuccess: onChartDataReceived,
  })

  const { data: latestRateData } = useQueryQuotes(
    exchangeRate
      ? undefined
      : [`${baseCurrency}${currenciesPairSeparator}${targetCurrency}`],
    REFETCH_QUOTES_INTERVAL,
    reversed ? QuoteRateSide.Ask : QuoteRateSide.Bid,
  )

  const latestRate = useMemo(() => {
    if (exchangeRate) {
      return {
        rate: exchangeRate.rate,
        timestamp: exchangeRate.timestamp,
        from: baseCurrency,
        to: targetCurrency,
      }
    }

    return latestRateData ? first(latestRateData) : undefined
  }, [exchangeRate, baseCurrency, latestRateData, targetCurrency])

  const latestFxChartData: FxLineChartDataDto | undefined = useMemo(() => {
    if (!fxChartData || isEmpty(fxChartData.points)) {
      return undefined
    }

    const processedFxChartData: FxLineChartDataDto = reversed
      ? {
          previousRangeCloseRate: (
            1.0 / parseFloat(fxChartData.previousRangeCloseRate)
          ).toFixed(4),
          points: fxChartData.points.map((point) => ({
            rate: (1.0 / parseFloat(point.rate)).toFixed(4),
            start: point.start,
          })),
        }
      : fxChartData

    return latestRate
      ? {
          ...processedFxChartData,
          points: [
            ...processedFxChartData.points,
            {
              start: latestRate.timestamp,
              rate: cropDecimalPart(latestRate.rate, 4).toString(),
            },
          ],
        }
      : processedFxChartData
  }, [fxChartData, latestRate, reversed])

  if (!latestFxChartData) {
    return <PriceChartSkeleton />
  }

  const baseValueConverted = cropDecimalPart(
    parseFloat(latestFxChartData.previousRangeCloseRate) * 100,
    4,
  )

  const lastRateConverted = cropDecimalPart(
    parseFloat(last<FxLineChartPointDto>(latestFxChartData.points)!.rate) * 100,
    4,
  )

  const baseValue = checkRequired(baseValueConverted, 'baseValue should be defined')
  const lastRate = checkRequired(lastRateConverted, 'lastRate should be defined')

  const moneyFormattingRules = getMoneyFormattingRules(maximumFractionDigits)

  const title = formatMoney(lastRate, targetCurrency, locale, moneyFormattingRules)

  const pnl = lastRate - baseValue
  const performance = pnl / baseValue

  const handleTimeRangeChange = (timeRange: ChartTimeRange) => {
    onTimeRangeChange(timeRange.value as FxRange)
  }

  const data = [
    {
      type: LightweightChartType.Area,
      data: latestFxChartData.points.map((point) => ({
        time: getChartTime(point.start),
        value: parseFloat(point.rate),
      })),
      options: {
        priceLineVisible: false,
        lastValueVisible: false,
      },
    },
  ]

  const timeRanges = [
    {
      title: t('range.1d'),
      value: FxRange.OneDay,
    },
    {
      title: t('range.1w'),
      value: FxRange.OneWeek,
    },
    {
      title: t('range.1mo'),
      value: FxRange.OneMonth,
    },
    {
      title: t('range.3mo'),
      value: FxRange.ThreeMonths,
    },
    {
      title: t('range.6mo'),
      value: FxRange.SixMonths,
    },
    {
      title: t('range.1y'),
      value: FxRange.OneYear,
    },
  ]

  return (
    <PriceChart
      chartHeight={chartHeight}
      data={data}
      description={
        <RatePerformance pnl={pnl} currency={targetCurrency} performance={performance} />
      }
      note={note}
      range={currentTimeRange}
      timeRanges={timeRanges}
      options={{
        localization: {
          priceFormatter: (price: number) =>
            formatMoney(price * 100, targetCurrency, locale, moneyFormattingRules),
        },
      }}
      title={title}
      visibleRange={visibleRange}
      onTimeRangeChange={handleTimeRangeChange}
    />
  )
}
