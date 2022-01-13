import { endOfMonth, format, startOfMonth, eachMonthOfInterval } from 'date-fns'
import * as dateFnsLocales from 'date-fns/locale'
import { last, first, sortedUniq } from 'lodash'

import { TransactionDto } from '@revolut/rwa-core-types'

export const getMonthsOptions = (
  transactions: TransactionDto[],
  createdDate: number,
  canFetchMore: boolean,
  locale: string,
) => {
  const knownMonths = transactions.length
    ? sortedUniq(
        transactions.map((transaction) =>
          endOfMonth(new Date(transaction.startedDate)).getTime(),
        ),
      ).reverse()
    : []

  const restMonths = eachMonthOfInterval({
    start: new Date(createdDate),
    end: knownMonths[0] ? new Date(knownMonths[0]) : endOfMonth(new Date()),
  }).map((month) => endOfMonth(month).getTime())

  const months = sortedUniq([...restMonths, ...knownMonths])

  const monthsOptions = months
    .map((month) => ({
      value: endOfMonth(month),
      label: format(month, 'MMMM yyyy', {
        locale: dateFnsLocales[locale] || dateFnsLocales.enGB,
      }),
    }))
    .filter((option) => {
      if (!transactions.length) {
        return option
      }

      const isMonthInLessThanLastTransactionMonth =
        endOfMonth(first(transactions)!.startedDate) >= option.value

      if (!canFetchMore) {
        return (
          isMonthInLessThanLastTransactionMonth &&
          startOfMonth(last(transactions)!.startedDate) <= startOfMonth(option.value)
        )
      }
      return isMonthInLessThanLastTransactionMonth
    })
  return monthsOptions
}
