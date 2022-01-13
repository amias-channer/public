import { TransactionDto } from '@revolut/rwa-core-types'

import { getAmountContributingToRunningBalance } from '../../utils'
import { CurrencySummary } from './types'

export const processTransactionCurrency = (
  currencySummary: CurrencySummary,
  transaction: TransactionDto,
) => {
  if (
    currencySummary.areCurrenciesSame &&
    (currencySummary.currency === null ||
      currencySummary.currency === transaction.currency)
  ) {
    return {
      areCurrenciesSame: true,
      currency: transaction.currency,
    }
  }

  return {
    areCurrenciesSame: false,
    currency: transaction.currency,
  }
}

export const addUpTransactionAmount = (
  totalAmount: number,
  transaction: TransactionDto,
) => {
  const amountContributingToRunningBalance =
    getAmountContributingToRunningBalance(transaction)
  totalAmount += amountContributingToRunningBalance
  return totalAmount
}
