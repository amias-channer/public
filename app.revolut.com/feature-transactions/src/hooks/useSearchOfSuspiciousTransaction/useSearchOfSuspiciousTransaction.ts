import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query'

import { TransactionDto } from '@revolut/rwa-core-types'

import { useCardWithSuspiciousTransaction } from '../useCardWithSuspiciousTransaction'

import { transactionPropertyChecker } from '../../utils'

const hasSuspiciousTransaction = (transactions: TransactionDto[]) =>
  transactions.find((transaction) => transactionPropertyChecker.isSuspicious(transaction))

export const useSearchOfSuspiciousTransaction = (
  transactions: TransactionDto[],
  fetchMore: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<TransactionDto[], unknown>>,
  canFetchMore?: boolean,
  isFetchingMore?: boolean,
) => {
  const cardWithSuspiciousTransaction = useCardWithSuspiciousTransaction()

  useEffect(() => {
    if (isEmpty(transactions) || isFetchingMore) {
      return
    }

    if (
      cardWithSuspiciousTransaction &&
      !hasSuspiciousTransaction(transactions) &&
      canFetchMore
    ) {
      fetchMore()
    }
  }, [
    canFetchMore,
    cardWithSuspiciousTransaction,
    fetchMore,
    isFetchingMore,
    transactions,
  ])
}
