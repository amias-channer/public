import { startOfDay, compareDesc } from 'date-fns'
import { groupBy, flow, pullAll } from 'lodash'

import { TransactionDto } from '@revolut/rwa-core-types'

import { TransactionsGroup } from '../../types'
import { transactionPropertyChecker } from '../../utils'
import { processTransactionCurrency, addUpTransactionAmount } from './helpers'
import { CurrencySummary } from './types'

const GROUP_HEADER_HEIGHT = 55
const CARD_HEIGHT = 77

// W/A to support several transactions desings during facelifting period
// Should be removed, when transactions facelifting will be over.
// https://revolut.atlassian.net/browse/PCONG-1382
type SizesForInfiniteLoading = {
  groupHeaderHeight?: number
  cardPadding?: number
  cardHeight?: number
}

type TransactionGroups = {
  suspicious: TransactionDto[]
  regular: TransactionsGroup[]
}

export const useTransactionGroups: (
  transactions: TransactionDto[],
  sizesForInfiniteLoading?: SizesForInfiniteLoading,
) => TransactionGroups = (
  transactions: TransactionDto[],
  {
    groupHeaderHeight = GROUP_HEADER_HEIGHT,
    cardHeight = CARD_HEIGHT,
    cardPadding = 0,
  }: SizesForInfiniteLoading = {},
) => {
  const suspiciousTransactions = transactions.filter((transaction) =>
    transactionPropertyChecker.isSuspicious(transaction),
  )

  const regularTransactions = pullAll(transactions, suspiciousTransactions)

  const ungroupedTransactionsSorted = regularTransactions.sort(
    (transactionA: TransactionDto, transactionB: TransactionDto) =>
      compareDesc(transactionA.startedDate, transactionB.startedDate),
  )

  const groupedTransactionsUnsorted = groupBy(
    ungroupedTransactionsSorted,
    flow(({ startedDate }) => startedDate, startOfDay),
  )

  const transactionGroups = Object.entries(groupedTransactionsUnsorted).sort(
    ([groupDate1], [groupDate2]) =>
      compareDesc(new Date(groupDate1), new Date(groupDate2)),
  )

  const transactionGroupsWithHeights = transactionGroups.map(
    ([groupDate, groupTransactions]) => {
      const groupHeight =
        groupHeaderHeight + cardPadding * 2 + groupTransactions.length * cardHeight

      const currenciesSummary = groupTransactions.reduce(processTransactionCurrency, {
        areCurrenciesSame: true,
        currency: null,
      } as CurrencySummary)

      const amount = currenciesSummary.areCurrenciesSame
        ? groupTransactions.reduce(addUpTransactionAmount, 0)
        : null

      const currency = currenciesSummary.currency

      return {
        groupDate,
        groupTransactions,
        groupHeight,
        amount,
        currency,
      }
    },
  )

  return {
    suspicious: suspiciousTransactions,
    regular: transactionGroupsWithHeights,
  }
}
