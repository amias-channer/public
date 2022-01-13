import { TFunction } from 'react-i18next'

import { CryptoExchangeMethod } from '../../../types'
import { I18N_NAMESPACE } from './constants'

export const checkIsCryptoBuyMethod = (exchangeMethod: CryptoExchangeMethod) =>
  exchangeMethod === CryptoExchangeMethod.Buy

type Args = {
  t: TFunction<typeof I18N_NAMESPACE>
  balanceAmount: number
  formattedLowerLimit: string
  lowerLimit?: number
  upperLimit?: number
  isCurrencyBuyMethod: boolean
  value?: number
}

export const getInputErrorMessage = ({
  t,
  balanceAmount,
  formattedLowerLimit,
  isCurrencyBuyMethod,
  lowerLimit,
  upperLimit,
  value,
}: Args) => {
  if (!value) {
    return undefined
  }

  const isUpperLimitExceeded = upperLimit && value && value > upperLimit

  const isBelowLowerLimit = lowerLimit && value && value > 0 && value < lowerLimit

  if (isUpperLimitExceeded) {
    return t('CryptoExchange.input.error.exceededLimit')
  }

  if (isBelowLowerLimit) {
    return t('CryptoExchange.input.error.belowLowerLimit', {
      amount: formattedLowerLimit,
    })
  }

  if (!isCurrencyBuyMethod && value > balanceAmount) {
    return t('CryptoExchange.input.error.exceededBalance')
  }

  return undefined
}
