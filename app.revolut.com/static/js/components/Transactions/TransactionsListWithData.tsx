import { noop } from 'lodash'
import { FC, useState, useMemo, useContext, useEffect } from 'react'

import { trackEvent, TransactionsListTrackingEvent } from '@revolut/rwa-core-analytics'
import {
  useQueryTransactions,
  checkIfShouldShowEmptyState,
  TransactionsListFilterContext,
  useSearchOfSuspiciousTransaction,
  FilterValue,
} from '@revolut/rwa-feature-transactions'

import { TransactionsList } from 'components'

import { useAutoScrollToTransaction } from './hooks'
import { GROUP_ROLE_NAME } from './TransactionListGroup'

type TransactionsListWithDataProps = {
  pocketId?: string
}

export const TransactionsListWithData: FC<TransactionsListWithDataProps> = ({
  pocketId,
}) => {
  const { dateFilter } = useContext(TransactionsListFilterContext)

  const [to, setTo] = useState<null | number>(null)

  const dataFilterValueTo = (dateFilter.value as FilterValue).to

  const {
    status,
    data: transactions,
    isFetchingMore,
    fetchMore,
    canFetchMore,
    // @ts-expect-error react-query typing issue https://github.com/tannerlinsley/react-query/issues/390
  } = useQueryTransactions(pocketId, to)

  useSearchOfSuspiciousTransaction(transactions, fetchMore, canFetchMore)
  useAutoScrollToTransaction({
    elementRole: GROUP_ROLE_NAME,
    transactions,
    isFetchingMore: Boolean(isFetchingMore),
    canFetchMore: Boolean(canFetchMore),
    fetchMore,
  })

  const isLoading = status === 'loading'

  const shouldShowEmptyState = useMemo(
    () => checkIfShouldShowEmptyState(transactions, isLoading, canFetchMore),
    [canFetchMore, isLoading, transactions],
  )

  useEffect(() => {
    trackEvent(TransactionsListTrackingEvent.listOpened, {
      pocketId,
    })

    return () => {
      trackEvent(TransactionsListTrackingEvent.listClosed, {
        pocketId,
      })
    }
  }, [pocketId])

  useEffect(() => {
    const isFromStartOfAccountActivity = dateFilter.isDefaultOption
    const filterValue = isFromStartOfAccountActivity
      ? null
      : new Date((dateFilter.value as FilterValue).to).getTime()

    if (filterValue !== to) {
      setTo(filterValue)
      trackEvent(TransactionsListTrackingEvent.filterSet, {
        pocketId,
        to: filterValue,
      })
    }
  }, [
    to,
    dateFilter.isDefaultOption,
    dateFilter.value,
    dataFilterValueTo,
    dateFilter,
    transactions,
    canFetchMore,
    fetchMore,
    pocketId,
  ])

  return (
    <TransactionsList
      isLoading={isLoading}
      isFetchingMore={Boolean(isFetchingMore)}
      shouldShowEmptyState={shouldShowEmptyState}
      transactions={transactions}
      fetchMore={canFetchMore ? fetchMore : noop}
      pocketId={pocketId}
    />
  )
}
