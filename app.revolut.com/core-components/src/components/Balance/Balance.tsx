import { getI18n } from 'react-i18next'
import { TextBox } from '@revolut/ui-kit'

import { getConfigValue, ConfigKey } from '@revolut/rwa-core-config'
import { DEFAULT_LOCALE, formatMoneyToParts } from '@revolut/rwa-core-utils'

type BalanceProps = {
  currency: string
  amount: number
}

const isFractionPart = (partType: Intl.NumberFormatPartTypes) =>
  partType === 'fraction' || partType === 'decimal'

export const Balance = ({ currency, amount }: BalanceProps) => {
  const i18n = getI18n()
  const locale = i18n.language || DEFAULT_LOCALE

  const moneyParts = formatMoneyToParts(amount, currency, locale)

  if (!moneyParts || !moneyParts.length) {
    return null
  }

  const isCurrency = (type: any) => type === 'currency'

  const currencies = getConfigValue(ConfigKey.Currencies)
  return (
    <>
      {moneyParts?.map(({ type, value }: Intl.NumberFormatPart) => {
        if (isFractionPart(type)) {
          return (
            <TextBox key={type} display="inline" variant={null} fontSize="0.7em">
              {value}
            </TextBox>
          )
        }

        if (isCurrency(type) && currencies[value]) {
          return currencies[value].symbol
        }

        return value
      })}
    </>
  )
}
