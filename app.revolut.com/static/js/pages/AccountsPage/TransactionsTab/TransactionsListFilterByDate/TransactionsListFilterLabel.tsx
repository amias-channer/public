import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { TransactionsListFilterText } from '../TransactionsListFilterText'

type TransactionsListFilterLabelProps = {
  isRestrictedAccessToken?: boolean
  selectedItem: {
    label: string
  } | null
}

export const TransactionsListFilterLabel: FC<TransactionsListFilterLabelProps> = ({
  isRestrictedAccessToken,
  selectedItem,
}) => {
  const { t } = useTranslation('pages.Accounts')

  if (isRestrictedAccessToken) {
    return (
      <TransactionsListFilterText
        color="grey-35"
        data-testid="transactions-list-filter-date-label"
      >
        {t('TransactionsTab.filter.last30Days')}
      </TransactionsListFilterText>
    )
  }

  return (
    selectedItem && (
      <TransactionsListFilterText data-testid="transactions-list-filter-date-label">
        {selectedItem.label}
      </TransactionsListFilterText>
    )
  )
}
