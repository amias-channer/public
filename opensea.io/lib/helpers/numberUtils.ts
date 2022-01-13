import BigNumber from "bignumber.js"
import { round } from "lodash"

export { BigNumber } from "bignumber.js"

export const ETH_DECIMALS = 18

const MAX_DECIMAL_PLACES_BY_SYMBOL: Record<string, number> = {
  DAI: 2,
  ETH: 4,
  MANA: 0,
  USDC: 2,
  WETH: 4,
  USD: 2,
}

const DECIMAL_PLACES_BY_SYMBOL: Record<string, number> = {
  USD: 2,
}
const MAX_DISPLAYED_DECIMAL_PLACES = 4

export const bn = (
  value: number | string | BigNumber,
  decimals?: number | null,
): BigNumber => {
  try {
    // toString() is used because numbers with more than 15 significant digits are not accepted
    return new BigNumber(value.toString()).shift(-(decimals ?? 0))
  } catch (_) {
    return new BigNumber(NaN)
  }
}

export const getMaxDecimals = (symbol: string): number => {
  const places = MAX_DECIMAL_PLACES_BY_SYMBOL[symbol]
  return places === undefined ? ETH_DECIMALS : places
}

export const displayUSD = (value: number | string | BigNumber) => {
  return display(value, "USD")
}

// TODO (joshuawu): Nice localized number display logic
// const removeTrailingZeroes = (value: string) =>
//   value.replace(/^(\d+)\.0*$/, "$1").replace(/^(\d+\.\d*[1-9])0+$/, "$1")

export const display = (
  value: number | string | BigNumber,
  symbol?: string,
  // _rounding?: "ceil" | "floor",
): string => {
  return normalizePriceDisplay(
    bn(value),
    Math.min(
      MAX_DISPLAYED_DECIMAL_PLACES,
      symbol ? getMaxDecimals(symbol) : MAX_DISPLAYED_DECIMAL_PLACES,
    ),
    symbol,
  )
  // const bnString = bn(value).toFixed(
  //   Math.min(
  //     MAX_DISPLAYED_DECIMAL_PLACES,
  //     symbol ? getMaxDecimals(symbol) : MAX_DISPLAYED_DECIMAL_PLACES,
  //   ),
  //   rounding && rounding === "ceil" ? 2 : 3,
  // )
  // return removeTrailingZeroes(bnString)
}

export const quantityDisplay = (value: number | string | BigNumber): string => {
  // Odd to be using this, but it works well.
  return normalizePriceDisplay(value)
}

export const isValidNumericInput = (
  str: string,
  maxDecimals?: number,
): boolean =>
  new RegExp(
    maxDecimals === 0
      ? "^([1-9]\\d*)?$"
      : `^(0|[1-9]\\d*)?(\\.\\d{0,${
          maxDecimals === undefined ? "" : maxDecimals
        }})?$`,
  ).test(str)

export const isValidPrice = (price: string, symbol: string): boolean =>
  isValidNumericInput(price, getMaxDecimals(symbol))

/**
 * Format a price for display as a localized string
 * @param num Price to normalize
 * @param decimals number of decimals allowed after decimal point
 */
export const normalizePriceDisplay = (
  num: string | BigNumber | number,
  decimals?: number,
  symbol?: string,
): string => {
  let ret
  if (decimals == null) {
    decimals = +num >= 1000 ? 2 : +num >= 10 ? 3 : 4
  }
  if (num === ".") {
    num = "0"
  }
  let str = (+num).toFixed(decimals)

  if (parseFloat(str) !== 0) {
    // This means that the number escapes the precision level
    // as a non-zero value, which is ideal.
    if (String(parseFloat(str)).length < str.length) {
      // Trailing zeroes exist after the precision is applied,
      // so we strip them out and return the result
      ret = String(parseFloat(str))
    } else if (parseFloat(str) == parseInt(str)) {
      // The number is basically N.00000
      // so we strip out the entire float and return it
      ret = String(parseInt(str))
    } else {
      ret = str
    }
  } else {
    str = (+num).toFixed(20)
    // 20 is the maximum precision allowed by toFixed
    // so we ignore precision and try to pull out the first
    // non-zero float

    // Return 0 if 20 decimal precision is not enough
    if (parseFloat(str) === 0) {
      ret = "0"
    } else {
      // 20 precision was enough but we may still have
      // trailing 0s. We want go through the string
      // to find the first non-zero decimal
      // and return the number up until that position
      // Ex. Turn 0.000000XYZ00 into 0.0000000X
      let cutoff = 0
      let inDecimal = false
      for (let i = 0, len = str.length; i < len; i++) {
        if (inDecimal && str[i] !== "0") {
          cutoff = i + 1
          break
        } else if (str[i] === ".") {
          inDecimal = true
        }
      }
      ret = str.substring(0, cutoff)
    }
  }

  // Final processing
  return parseFloat(ret).toLocaleString(
    undefined,
    symbol && DECIMAL_PLACES_BY_SYMBOL[symbol]
      ? {
          minimumFractionDigits: DECIMAL_PLACES_BY_SYMBOL[symbol],
          maximumFractionDigits: DECIMAL_PLACES_BY_SYMBOL[symbol],
        }
      : {
          minimumSignificantDigits: 1,
        },
  )
}

export const basisPointsToPercentage = (basisPoints: number) =>
  ((basisPoints || 0) / 100).toFixed(2)

export function shortSymbolDisplay(
  value: number,
  {
    digits = 1,
    threshold = Number.MIN_VALUE,
    formatDisplay = false,
  }: { digits?: number; threshold?: number; formatDisplay?: boolean } = {},
) {
  if (value < threshold) {
    return formatDisplay ? quantityDisplay(value) : `${value}`
  }

  const floorValue = Math.floor(value)
  if (floorValue < 1_000) {
    return value.toFixed(0)
  } else if (floorValue < 1_000_000) {
    return `${(value / 1_000).toFixed(digits)}K`
  } else if (floorValue < 1_000_000_000) {
    return `${(value / 1_000_000).toFixed(digits)}M`
  }
  return `> 1 billion`
}

export const padEndZeros = (value: string | number, decimals: number) => {
  const valueStr = `${value}`
  const decimalPlaceIndex = valueStr.indexOf(".")
  if (decimalPlaceIndex === -1) {
    return `${valueStr}.`.padEnd(valueStr.length + 1 + decimals, "0")
  }

  const existingDecimalPlaces = valueStr.length - decimalPlaceIndex - 1
  return valueStr.padEnd(
    valueStr.length + decimals - existingDecimalPlaces,
    "0",
  )
}

export const calculatePercentages = (count: number, total: number) => {
  return Math.min(+bn(count).times(100).div(bn(total)), 100)
}

export const roundAboveMin = (price: number, decimals = 2) => {
  const min = 10 ** -decimals
  if (price >= min) {
    return `${round(price, decimals)}`
  }
  return `< ${min}`
}
