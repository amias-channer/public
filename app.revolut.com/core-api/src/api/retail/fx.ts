import axios from 'axios'

import {
  ExchangeRequestDto,
  ExchangeResponseDto,
  FxLineChartDataDto,
  FxChartType,
  FxInterval,
  FxRange,
} from '@revolut/rwa-core-types'

export const exchange = async (requestData: ExchangeRequestDto) => {
  const { data } = await axios.post<ExchangeResponseDto[]>(
    '/retail/exchange',
    requestData,
  )

  return data
}

export const fetchFxLineChartData = async (
  currenciesPair: string,
  fxRange: FxRange,
  fxInterval: FxInterval,
) => {
  const { data } = await axios.get<FxLineChartDataDto>(
    `/retail/fx-charts/${currenciesPair}`,
    {
      params: {
        interval: fxInterval,
        range: fxRange,
        type: FxChartType.Line,
      },
    },
  )

  return data
}
