import { useCallback, useRef, useState } from 'react'
import { first, last } from 'lodash'

import { FxLineChartDataDto, FxRange } from '@revolut/rwa-core-types'

import { getChartTime } from '../../utils'
import { LightweightChartsRange } from '../PriceChart'

export const useFxLineChart = () => {
  const [visibleRange, setVisibleRange] = useState<LightweightChartsRange>()
  const [currentTimeRange, setCurrentTimeRange] = useState<FxRange>(FxRange.OneDay)

  const prevTimeRange = useRef<string>()

  const handleChartDataReceived = useCallback(
    (fxChartData: FxLineChartDataDto) => {
      const from = first(fxChartData.points)?.start
      const to = last(fxChartData.points)?.start

      if (
        (prevTimeRange.current === undefined ||
          prevTimeRange.current !== currentTimeRange) &&
        from &&
        to
      ) {
        setVisibleRange({ from: getChartTime(from), to: getChartTime(to) })

        prevTimeRange.current = currentTimeRange
      }
    },
    [currentTimeRange],
  )

  return {
    currentTimeRange,
    visibleRange,
    onChartDataReceived: handleChartDataReceived,
    onTimeRangeChange: setCurrentTimeRange,
  }
}
