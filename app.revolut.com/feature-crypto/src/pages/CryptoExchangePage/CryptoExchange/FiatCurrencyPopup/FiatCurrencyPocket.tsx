import { VFC } from 'react'

import { Currency } from '@revolut/rwa-core-config'
import { CurrencyItem } from '@revolut/rwa-core-components'
import { Pocket } from '@revolut/rwa-core-types'
import { useGetPocketNameByCurrency } from '@revolut/rwa-core-utils'

type Props = {
  pocket: Pocket
  isSelected: boolean
  onCurrencyChange: (currency: Currency) => void
}

export const FiatCurrencyPocket: VFC<Props> = ({
  pocket,
  isSelected,
  onCurrencyChange,
}) => {
  const pocketCurrency = pocket.currency

  const pocketTitle = useGetPocketNameByCurrency(pocketCurrency) ?? pocketCurrency

  return (
    <CurrencyItem
      amount={pocket.balance}
      title={pocketTitle}
      currency={pocketCurrency}
      isSelected={isSelected}
      onClick={() => onCurrencyChange(pocketCurrency)}
    />
  )
}
