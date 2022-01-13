import { TransactionDto } from '@revolut/rwa-core-types'

import { MoneyProps } from '../types'
import { failedTransactionStatuses } from './constants'
import { isPending } from './transactionPropertyChecker'

export const getMoneyProps = (transaction: TransactionDto): MoneyProps => {
  const { amount, currency, counterpart, state, fee } = transaction

  const isStrikethru = failedTransactionStatuses.includes(state)
  const withSign = !isStrikethru

  const main = {
    amount: amount - fee,
    currency,
    isGrey: isPending(transaction) || isStrikethru,
    isStrikethru,
    withSign,
  }

  if (counterpart?.currency && counterpart?.currency !== currency) {
    const counterpartProps = {
      amount: counterpart?.amount,
      currency: counterpart?.currency,
      isStrikethru,
      withSign,
    }

    return {
      main,
      counterpart: counterpartProps,
    }
  }

  return {
    main,
  }
}
