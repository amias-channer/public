import { minBy, isUndefined } from 'lodash'
import { startOfDay } from 'date-fns'
import { useState, useCallback, useEffect, RefObject } from 'react'
import { FetchNextPageOptions, InfiniteQueryObserverResult } from 'react-query'
import { VirtuosoHandle } from 'react-virtuoso'

import { TransactionDto } from '@revolut/rwa-core-types'

import { TransactionsGroup } from '../types'

export const useScrollToGroup = (
  transactions: TransactionDto[],
  transactionGroups: TransactionsGroup[],
  canFetchMore: boolean,
  isFetchingMore: boolean,
  fetchMore: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<InfiniteQueryObserverResult<TransactionDto[], unknown>>,
  virtuosoRef: RefObject<VirtuosoHandle | null>,
) => {
  const [requiredLegId, setRequiredLegId] = useState<string>()
  const [requiredDate, setRequiredDate] = useState<Date>()
  const [isSearching, setIsSearching] = useState(false)

  const scrollToDate = (date: Date) => {
    setRequiredDate(date)
  }

  const scrollToTransactionGroup = (legId: string) => {
    setRequiredLegId(legId)
  }

  const getIndexToScroll = useCallback(
    (toDate: Date) => {
      const date = startOfDay(toDate)
      const transactionTimeDistances = transactionGroups.map(({ groupDate }, index) => ({
        diff: date.getTime() - new Date(groupDate).getTime(),
        index,
      }))

      if (transactionTimeDistances.every(({ diff }) => diff < 0)) {
        return undefined
      }

      if (transactionTimeDistances.every(({ diff }) => diff > 0)) {
        return 0
      }

      const found = minBy(
        transactionTimeDistances.filter(({ diff }) => diff >= 0),
        ({ diff }) => diff,
      )
      return found?.index
    },
    [transactionGroups],
  )

  const doScrolling = useCallback(
    (index: number) => {
      setTimeout(() => {
        virtuosoRef.current?.scrollToIndex({ index, align: 'center' })

        setRequiredLegId(undefined)
        setRequiredDate(undefined)
        setIsSearching(false)
      })
    },
    [virtuosoRef],
  )

  useEffect(() => {
    if (
      (!requiredLegId && !requiredDate) ||
      !transactionGroups.length ||
      isFetchingMore
    ) {
      return
    }

    let groupDate = requiredDate

    if (requiredLegId) {
      const transaction = transactions.find((txn) => txn.legId === requiredLegId)
      if (transaction) {
        groupDate = new Date(transaction.startedDate)
      }
    }

    const indexToScroll = groupDate ? getIndexToScroll(groupDate) : undefined
    if (isUndefined(indexToScroll)) {
      if (canFetchMore) {
        fetchMore()
        setIsSearching(true)
        return
      }
      doScrolling(transactionGroups.length - 1)
      return
    }
    doScrolling(indexToScroll)
  }, [
    canFetchMore,
    doScrolling,
    fetchMore,
    getIndexToScroll,
    isFetchingMore,
    requiredDate,
    requiredLegId,
    transactionGroups.length,
    transactions,
  ])

  return {
    isSearching,
    scrollToDate,
    scrollToTransactionGroup,
    getIndexToScroll,
  }
}
