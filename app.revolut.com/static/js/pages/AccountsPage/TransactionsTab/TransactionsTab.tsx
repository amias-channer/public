import { FC, useEffect } from 'react'
import { getI18n, useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Chain } from '@revolut/ui-kit'

import { User, UUID } from '@revolut/rwa-core-types'
import {
  DEFAULT_LOCALE,
  QueryKey,
  isRestrictedAccessToken,
} from '@revolut/rwa-core-utils'
import {
  TransactionsListFilterContext,
  useTransactionsListFilterByDate,
  useTransactionsListFiltersState,
} from '@revolut/rwa-feature-transactions'

import { TransactionsListWithData } from 'components/Transactions/TransactionsListWithData'

import { I18N_NAMESPACE } from '../constants'
import { TransactionsListFilterByDate } from './TransactionsListFilterByDate'
import { TransactionsListFilterText } from './TransactionsListFilterText'
import { TransactionsMenuLayout } from './TransactionsMenuLayout'

type TransactionsTabProps = {
  pocketId?: UUID
  user: User
  isFromStartOfAccountActivity?: boolean
}

export const TransactionsTab: FC<TransactionsTabProps> = ({
  user,
  isFromStartOfAccountActivity,
  pocketId,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(I18N_NAMESPACE)
  const i18n = getI18n()
  const locale = i18n.language || DEFAULT_LOCALE
  const filterByDate = useTransactionsListFilterByDate(
    user.createdDate,
    t,
    locale,
    isRestrictedAccessToken(),
    isFromStartOfAccountActivity,
  )

  const filtersState = useTransactionsListFiltersState(filterByDate)

  useEffect(() => {
    return () => {
      if (pocketId) {
        queryClient.removeQueries(QueryKey.Transactions)
      }
    }
  }, [queryClient, pocketId])
  return (
    <TransactionsListFilterContext.Provider value={filtersState}>
      <TransactionsMenuLayout isRestrictedAccessToken={isRestrictedAccessToken()}>
        <Chain.Item>
          <TransactionsListFilterText>
            {t('TransactionsTab.title')}
          </TransactionsListFilterText>
        </Chain.Item>
        <Chain.Item>
          <TransactionsListFilterByDate
            isRestrictedAccessToken={isRestrictedAccessToken()}
          />
        </Chain.Item>
      </TransactionsMenuLayout>
      <TransactionsListWithData pocketId={pocketId} />
    </TransactionsListFilterContext.Provider>
  )
}
