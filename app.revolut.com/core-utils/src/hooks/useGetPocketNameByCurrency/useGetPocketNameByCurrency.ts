import { useTranslation } from 'react-i18next'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { CurrenciesType } from '@revolut/rwa-core-types'

import { I18nNamespace } from '../../utils'

export const useGetPocketNameByCurrency = (currency: string) => {
  const { t } = useTranslation(I18nNamespace.Domain)
  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)

  if (!currency) {
    return null
  }

  const pocketCurrencyName = currencies[currency] ? t(`currency-${currency}-name`) : null

  if (pocketCurrencyName) {
    return `${pocketCurrencyName}`
  }

  return currency
}
