import { AssetsQuoteResponseDto } from '@revolut/rwa-core-types'

export const extractFinalRate = (assetsQuote: AssetsQuoteResponseDto) =>
  Number(assetsQuote.rate.finalRate)

export const cropDecimalPart = (value: number, fractionDigits: number) =>
  parseFloat(value.toFixed(fractionDigits))
