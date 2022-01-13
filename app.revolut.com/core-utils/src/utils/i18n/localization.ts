import { isObject } from 'lodash'

type LocalizationParam = { key?: string; value?: string }

type PreparedParam = {
  [key: string]: string | number
}

export type LocalizationArgument = {
  key: string
  param?: PreparedParam
}

const processParams = (params: LocalizationParam[]): PreparedParam | null => {
  if (params?.length > 0 && params[0] && params[0].value) {
    return {
      param: params[0].value,
    }
  }

  return null
}
export const localization = {
  getStringWithParamsArray: (
    key: string,
    params?: LocalizationParam[],
  ): LocalizationArgument => {
    if (params) {
      const p = processParams(params)
      if (p) {
        return { key, param: p }
      }
      return {
        key,
      }
    }

    return {
      key,
    }
  },

  getString: (
    key: string,
    params?: string | number | { [key: string]: string | number },
  ): LocalizationArgument => {
    if (params) {
      return {
        key,
        param: isObject(params) ? params : { param: params },
      }
    }

    return {
      key,
    }
  },

  // @ts-expect-error
  getStringWithParamTranslationRequired: (key: string, paramWhichRequiresTranslation) => {
    return key
  },
}

export const currencyLocalization = {
  getCurrencyDisplayNameByCode: (currencyCode: string) => {
    return `currency-${currencyCode}-name`
  },
}

export const DEFAULT_LOCALE = 'en-GB'
