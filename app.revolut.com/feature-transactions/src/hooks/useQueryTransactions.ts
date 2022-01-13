import { last } from 'lodash'
import compact from 'lodash/compact'
import { useInfiniteQuery } from 'react-query'
import * as Sentry from '@sentry/react'

import { TransactionDto } from '@revolut/rwa-core-types'
import { QueryKey, SentryTag } from '@revolut/rwa-core-utils'

import { getLastTransactions } from '../api'

import { usePrepareTransactions } from './usePrepareTransactions'

export const TRANSACTIONS_INFINITE_SCROLL_BATCH_SIZE = 50

type Variables = {
  to?: number
  accountId?: string
}

const getTransactions =
  (accountId?: string) =>
  async ({ to }: Variables, earliestTimestamp?: number) => {
    try {
      const isFromStartOfAccountActivity = to === null
      const shouldUseEarliestTimeStamp = isFromStartOfAccountActivity || earliestTimestamp
      const toParameter = shouldUseEarliestTimeStamp ? earliestTimestamp : to
      const { data } = await getLastTransactions({
        count: TRANSACTIONS_INFINITE_SCROLL_BATCH_SIZE,
        to: toParameter,
        accountId,
      })

      return data
    } catch (e) {
      Sentry.captureException(e, {
        tags: { [SentryTag.Context]: 'query transactions' },
      })
      return []
    }
  }

export const useQueryTransactions = (accountId?: string, to?: number) => {
  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      [QueryKey.Transactions, { to, accountId }],
      ({ pageParam }) => getTransactions(accountId)({ to }, pageParam),
      {
        getNextPageParam: (lastBatch) => {
          if (lastBatch.length > 0) {
            const lastItemFromLastBatch = last(lastBatch) as TransactionDto
            const earliestTimestamp = lastItemFromLastBatch.startedDate

            return earliestTimestamp
          }

          return false
        },

        staleTime: Infinity,
      },
    )

  const processedData = usePrepareTransactions(compact(data?.pages) ?? [], accountId)

  return {
    status,
    data: processedData,
    isFetchingMore: isFetchingNextPage,
    fetchMore: fetchNextPage,
    canFetchMore: hasNextPage,
  }
}
