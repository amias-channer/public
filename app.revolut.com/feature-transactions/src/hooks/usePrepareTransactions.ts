import { uniqBy } from 'lodash'
import { useMemo } from 'react'

import { TransactionDto, UUID } from '@revolut/rwa-core-types'
import { concatTransactionsBatch } from '../utils'

export const usePrepareTransactions = (data: TransactionDto[][], accountId?: UUID) => {
  return useMemo(() => {
    const checkIfTransactionShouldBeDisplayed = (transaction: TransactionDto) => {
      const isForRelevantAccount = !accountId || transaction?.account?.id === accountId
      return isForRelevantAccount
    }

    return uniqBy(
      concatTransactionsBatch(data, Boolean(accountId)),
      (transaction) => transaction.legId,
    ).filter(checkIfTransactionShouldBeDisplayed)
  }, [data, accountId])
}
