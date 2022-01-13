import * as Icons from '@revolut/icons'

import {
  TransactionCategory,
  TransactionType,
  TransactionDto,
} from '@revolut/rwa-core-types'
import { transactionPropertyChecker } from '@revolut/rwa-feature-transactions'

const METAL_CASHBACK_DESCRIPTION = 'Metal Cashback'

export const getIcon = (transaction: TransactionDto) => {
  const { type, logo, category, merchant, description } = transaction

  if (
    (transactionPropertyChecker.isDeclinedOrFailed(transaction) &&
      !transactionPropertyChecker.isSuspicious(transaction)) ||
    transactionPropertyChecker.isReverted(transaction)
  ) {
    return Icons.Reverted
  }

  if (
    transactionPropertyChecker.investmentAccountFund(transaction) ||
    transactionPropertyChecker.investmentAccountWithdraw(transaction)
  ) {
    return Icons.Wealth
  }

  if (
    transactionPropertyChecker.isLoungePasses(transaction) &&
    type === TransactionType.Fee
  ) {
    return Icons.Lounges
  }

  switch (type) {
    case TransactionType.Exchange:
      return Icons.ActionExchange
    case TransactionType.Fee:
      return Icons.LogoRevolut
    case TransactionType.Transfer:
      return Icons.ArrowSend
    case TransactionType.Topup:
    case TransactionType.TopupChargeback:
      return Icons.ActionTopUp
    case TransactionType.TopupReturn:
    case TransactionType.CardRefund:
    case TransactionType.Refund:
      return Icons.Refund
    case TransactionType.Atm:
      return Icons.Cash
    case TransactionType.CardPayment: {
      if (logo) {
        return `https://assets.revolut.com/merchant_icons/${logo}@2x.png`
      }

      if (merchant?.logo) {
        return merchant.logo
      }

      switch (category) {
        case TransactionCategory.Services:
          return Icons.Services
        case TransactionCategory.Travel:
          return Icons.Travel
        case TransactionCategory.Transport:
          return Icons.Transport
        case TransactionCategory.Health:
          return Icons.Health
        case TransactionCategory.Utilities:
          return Icons.Utilities
        case TransactionCategory.Entertainment:
          return Icons.Entertainment
        case TransactionCategory.Shopping:
          return Icons.Shopping
        case TransactionCategory.Groceries:
          return Icons.Groceries
        case TransactionCategory.Restaurants:
          return Icons.Restaurants
        default:
          return Icons.Shopping
      }
    }
    case TransactionType.Reward:
      if (description === METAL_CASHBACK_DESCRIPTION) {
        return Icons.Safe
      }
      return Icons.Gift
    case TransactionType.Cashback:
      return Icons.Gift
    case TransactionType.Trade:
      return Icons.Wealth
    case TransactionType.LoanPayment:
    case TransactionType.Loan:
    case TransactionType.LoanPayoff:
      return Icons.Gift
    case TransactionType.Unknown:
      return Icons.Unknown
    default:
      return undefined
  }
}
