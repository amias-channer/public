import {
  createChart,
  IChartApi,
  LineData,
  WhitespaceData,
  ISeriesApi,
  AreaStyleOptions,
  SeriesOptionsCommon,
  DeepPartial,
  ChartOptions,
  HistogramStyleOptions,
  HistogramData,
  TimeRange,
} from 'lightweight-charts'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Absolute,
  Relative,
  UnifiedTheme,
  useTheme,
  themeColor,
  Color,
} from '@revolut/ui-kit'

import { Z_INDICES } from '@revolut/rwa-core-styles'

const getChartOptions = (theme: UnifiedTheme): DeepPartial<ChartOptions> => ({
  handleScale: {
    axisPressedMouseMove: false,
  },
  rightPriceScale: {
    borderColor: themeColor(Color.GREY_TONE_5)({ theme }),
    autoScale: true,
    scaleMargins: {
      bottom: 0.05,
    },
    entireTextOnly: true,
  },
  timeScale: {
    borderColor: themeColor(Color.GREY_TONE_5)({ theme }),
    timeVisible: true,
    fixLeftEdge: true,
    fixRightEdge: true,
  },
  layout: {
    backgroundColor: themeColor(Color.WIDGET_BACKGROUND)({ theme }),
    textColor: themeColor(Color.GREY_TONE_50)({ theme }),
    fontFamily: theme.fonts.default,
  },
  grid: {
    vertLines: {
      color: 'transparent',
    },
    horzLines: {
      color: themeColor(Color.GREY_TONE_5)({ theme }),
    },
  },
})

const BARS_LIMIT = 100
const VISIBLE_LOGICAL_RANGE_CHANGE_TIMEOUT = 100

export const LightweightChartType = {
  Area: 'Area',
  Histogram: 'Histogram',
} as const

export type LightweightChartData =
  | {
      type: typeof LightweightChartType.Area
      data: (LineData | WhitespaceData)[]
      options?: DeepPartial<AreaStyleOptions & SeriesOptionsCommon>
      onFetchMore?: VoidFunction
    }
  | {
      type: typeof LightweightChartType.Histogram
      data: (HistogramData | WhitespaceData)[]
      options?: DeepPartial<HistogramStyleOptions & SeriesOptionsCommon>
      onFetchMore?: VoidFunction
    }

type Props = {
  height?: number
  data: LightweightChartData[]
  options?: DeepPartial<ChartOptions>
  visibleRange?: TimeRange
}

const updateChart = (
  chart: IChartApi,
  series: (ISeriesApi<'Area'> | ISeriesApi<'Histogram'>)[],
  data: LightweightChartData[],
  theme: UnifiedTheme,
) => {
  data.forEach((item, index) => {
    let currentSeries = series[index]

    if (!currentSeries) {
      if (item.type === LightweightChartType.Area) {
        currentSeries = chart.addAreaSeries({
          topColor: themeColor(Color.BLUE_10)({
            theme,
          }),

          lineColor: themeColor(Color.BLUE)({
            theme,
          }),
          bottomColor: 'transparent',
          lineWidth: 1,
          ...item.options,
        })
      } else {
        currentSeries = chart.addHistogramSeries(item.options)
      }

      series[index] = currentSeries
    }

    currentSeries.setData(item.data)

    const timeScale = chart.timeScale()

    let timer: number | undefined

    timeScale.subscribeVisibleLogicalRangeChange(() => {
      if (timer !== undefined) {
        return
      }

      timer = window.setTimeout(() => {
        const logicalRange = timeScale.getVisibleLogicalRange()

        if (logicalRange !== null) {
          const barsInfo = currentSeries.barsInLogicalRange(logicalRange)

          if (barsInfo !== null && barsInfo.barsBefore < BARS_LIMIT) {
            if (item.onFetchMore) {
              item.onFetchMore()
            }
          }
        }

        timer = undefined
      }, VISIBLE_LOGICAL_RANGE_CHANGE_TIMEOUT)
    })
  })
}

export const LightweightChart = ({ data, height, options = {}, visibleRange }: Props) => {
  const theme = useTheme<UnifiedTheme>()

  const wrapperElRef = useRef<HTMLDivElement>(null)
  const chartElRef = useRef<HTMLDivElement>(null)

  const chartRef = useRef<IChartApi>()
  const seriesRef = useRef<(ISeriesApi<'Area'> | ISeriesApi<'Histogram'>)[]>([])

  const chartOptions = useMemo(() => getChartOptions(theme), [theme])

  useEffect(() => {
    if (!chartRef.current && chartElRef.current && wrapperElRef.current) {
      chartRef.current = createChart(chartElRef.current, {
        width: wrapperElRef.current.clientWidth,
        height: height ?? wrapperElRef.current.clientHeight,
        ...chartOptions,
        ...options,
      })
    }
  }, [height, options, chartOptions])

  useEffect(() => {
    if (chartRef.current) {
      updateChart(chartRef.current, seriesRef.current, data, theme)
    }
  }, [data, theme])

  useEffect(() => {
    if (visibleRange && chartRef.current) {
      chartRef.current.timeScale().setVisibleRange(visibleRange)
    }
  }, [visibleRange])

  const handleResize = useCallback(() => {
    if (chartRef.current && wrapperElRef.current) {
      chartRef.current.resize(
        wrapperElRef.current.clientWidth,
        wrapperElRef.current.clientHeight,
      )
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', () => handleResize())

    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <Relative ref={wrapperElRef} height={height ?? '100%'} zIndex={Z_INDICES.zero}>
      <Absolute ref={chartElRef} />
    </Relative>
  )
}
