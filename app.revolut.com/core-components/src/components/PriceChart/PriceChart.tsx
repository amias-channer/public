import {
  DeepPartial,
  ChartOptions,
  TimeRange,
  HistogramStyleOptions,
  SeriesOptionsCommon,
} from 'lightweight-charts'
import { ReactNode, FC } from 'react'
import {
  Text,
  Skeleton,
  Link,
  ChartWidget,
  TabBar,
  Flex,
  TextProps,
} from '@revolut/ui-kit'

import { LightweightChart, LightweightChartData } from './LightweightChart'

import { PriceChartWidget, CondensedTabBarItem, ChartWidgetTitleStyled } from './styled'

export type ChartTimeRange = {
  value: string
  title: string
}

type Props = {
  title: ReactNode
  description: ReactNode
  timeRanges: ChartTimeRange[]
  data: LightweightChartData[]
  range: string
  chartHeight?: number
  note?: ReactNode
  onTimeRangeChange: (timeRange: ChartTimeRange) => void
  withShadow?: boolean
  options?: DeepPartial<ChartOptions>
  visibleRange?: TimeRange
  chartDataOptions?: DeepPartial<HistogramStyleOptions & SeriesOptionsCommon>
  disclaimerProps?: TextProps
}

export const PriceChart: FC<Props> = ({
  title,
  description,
  timeRanges,
  data,
  range,
  note,
  chartHeight,
  onTimeRangeChange,
  withShadow = false,
  options = {},
  visibleRange,
  disclaimerProps = {},
}) => {
  const onTimeRangeClickHandler = (timeRange: ChartTimeRange) => () => {
    onTimeRangeChange(timeRange)
  }

  return (
    <PriceChartWidget mb="s-32" height="100%" withShadow={withShadow}>
      <ChartWidgetTitleStyled>{title}</ChartWidgetTitleStyled>
      <ChartWidget.Description>{description}</ChartWidget.Description>
      <ChartWidget.Chart flex={1}>
        <LightweightChart
          data={data}
          height={chartHeight}
          options={options}
          visibleRange={visibleRange}
        />
      </ChartWidget.Chart>
      <ChartWidget.Legend>
        <Flex flexDirection="column" width="100%">
          <TabBar variant="segmented" width="100%" mb="s-24">
            {timeRanges.map((timeRange) => (
              <CondensedTabBarItem
                key={timeRange.title}
                use="button"
                aria-selected={range === timeRange.value}
                onClick={onTimeRangeClickHandler(timeRange)}
              >
                {timeRange.title}
              </CondensedTabBarItem>
            ))}
          </TabBar>
          {note && (
            <Text
              variant="caption"
              color="grey-tone-50"
              textAlign="center"
              {...disclaimerProps}
            >
              {note}
            </Text>
          )}
          <Text
            variant="caption"
            color="grey-tone-50"
            textAlign="center"
            {...disclaimerProps}
          >
            TradingView Lightweight Charts
            <br />
            Copyright (с) 2020 TradingView, Inc.
            <Link
              color="grey-tone-50"
              href="https://www.tradingview.com/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.tradingview.com/
            </Link>
          </Text>
        </Flex>
      </ChartWidget.Legend>
    </PriceChartWidget>
  )
}

type PriceChartSkeletonProps = Pick<Props, 'chartHeight' | 'withShadow'>

export const PriceChartSkeleton: FC<PriceChartSkeletonProps> = ({
  chartHeight,
  withShadow = false,
}) => (
  <PriceChartWidget mb="s-32" height="100%" withShadow={withShadow}>
    <ChartWidgetTitleStyled>
      <Skeleton height="2rem" borderRadius="8px" width="5rem" />
    </ChartWidgetTitleStyled>
    <ChartWidget.Description>
      <Skeleton width="10rem" height="1rem" />
    </ChartWidget.Description>
    <ChartWidget.Chart>
      <Skeleton size="100%" borderRadius="8px" minHeight={chartHeight} />
    </ChartWidget.Chart>
  </PriceChartWidget>
)
