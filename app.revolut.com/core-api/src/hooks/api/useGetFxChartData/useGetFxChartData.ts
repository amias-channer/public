import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'
import { FxInterval, FxLineChartDataDto, FxRange } from '@revolut/rwa-core-types'

import { fetchFxLineChartData } from '../../../api'

const REFETCH_FX_CHART_DATA_INTERVAL = 30_000

export const useGetFxChartData = ({
  currenciesPair,
  fxInterval,
  fxRange,
  onSuccess,
}: {
  currenciesPair: string
  fxInterval: FxInterval
  fxRange: FxRange
  onSuccess: (data: FxLineChartDataDto) => void
}) => {
  const encodedCurrenciesPair = encodeURIComponent(currenciesPair)

  const { data: fxChartData } = useQuery(
    [QueryKey.FxLineChart, currenciesPair, fxRange],
    () => fetchFxLineChartData(encodedCurrenciesPair, fxRange, fxInterval),
    {
      keepPreviousData: true,
      refetchInterval: REFETCH_FX_CHART_DATA_INTERVAL,
      onSuccess,
    },
  )

  return {
    fxChartData,
  }
}
