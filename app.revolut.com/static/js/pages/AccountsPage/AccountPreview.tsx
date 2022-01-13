import { FC } from 'react'
import { Circle } from '@revolut/ui-kit'

import { CountryFlag } from '@revolut/rwa-core-components'
import { Currency, PocketState } from '@revolut/rwa-core-types'
import { getCountryCodeByCurrencyCode, useCurrencyName } from '@revolut/rwa-core-utils'

import { AccountCard } from './AccountCard'

type AccountPreviewProps = {
  currency: Currency | string
  amount: number
  disabled: boolean
  state: PocketState
}

export const AccountPreview: FC<AccountPreviewProps> = (props) => {
  const { currency, amount, state } = props

  const currencyName = useCurrencyName(currency)

  const isDisabled = state === PocketState.Inactive

  return (
    <AccountCard
      title={currencyName}
      subtitle={currency}
      currency={currency}
      balance={amount}
      avatar={
        <Circle bg="grey-90" size={40}>
          <CountryFlag country={getCountryCodeByCurrencyCode(currency)} size={40} />
        </Circle>
      }
      testId={`account-card-${currency}`}
      disabled={isDisabled}
    />
  )
}
