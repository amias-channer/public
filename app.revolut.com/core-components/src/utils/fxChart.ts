import getUnixTime from 'date-fns/getUnixTime'

import { LightweightChartsTime } from '../components/PriceChart'

export const getChartTime = (timestamp: number) =>
  (getUnixTime(timestamp) - new Date().getTimezoneOffset() * 60) as LightweightChartsTime
