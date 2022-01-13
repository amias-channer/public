export enum FxChartType {
  Line = 'LINE',
  CandleStick = 'CANDLESTICK',
}

export enum FxRange {
  OneDay = '1d',
  OneWeek = '1w',
  SevenDays = '7d',
  OneMonth = '1mo',
  ThirtyDays = '30d',
  ThreeMonths = '3mo',
  SixMonths = '6mo',
  TwelveMonths = '12mo',
  OneYear = '1y',
}

export enum FxInterval {
  FiveMinutes = '5m',
  FifteenMinutes = '15m',
  ThirtyMinutes = '30m',
  OneHour = '1h',
  NinetyMinutes = '90m',
  FourHours = '4h',
  OneDay = '1d',
  TwoDays = '2d',
  FourDays = '4d',
  OneWeek = '1w',
  SevenDays = '7d',
}

export type ExchangeRate = {
  rate: number
  timestamp: number
}
