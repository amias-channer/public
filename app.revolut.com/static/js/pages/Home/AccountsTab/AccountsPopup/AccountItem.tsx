import { FC, MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

import { PocketState } from '@revolut/rwa-core-types'
import { CurrencyItem } from '@revolut/rwa-core-components'

import { getPocketNameByCurrency } from 'pages/Account/AccountHeader/helpers'
import { PocketConvertedForDisplay } from 'pages/AccountsPage/types'

type AccountItemProps = PocketConvertedForDisplay & {
  selected?: boolean
  onClick: MouseEventHandler<HTMLDivElement>
}

const I18N_NAMESPACE = 'domain'

export const AccountItem: FC<AccountItemProps> = ({
  currency,
  state,
  selected,
  onClick,
  amount,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const title = getPocketNameByCurrency(t, currency) || ''
  const isAccountInactive = state && state === PocketState.Inactive

  return (
    <CurrencyItem
      title={title}
      currency={currency}
      isSelected={selected}
      onClick={onClick}
      isInactive={isAccountInactive}
      amount={amount}
    />
  )
}
