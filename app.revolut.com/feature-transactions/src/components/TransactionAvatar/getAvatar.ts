import * as Icons from '@revolut/icons'
import { Color } from '@revolut/ui-kit'

import {
  TransactionCategory,
  TransactionType,
  TransactionDto,
  TransactionStatusReasonCodes,
} from '@revolut/rwa-core-types'

import { transactionPropertyChecker } from '../../utils'

const METAL_CASHBACK_DESCRIPTION = 'Metal Cashback'

type TransactionIcon = {
  image?: string
  icon?: Icons.IconComponentType
}

type TransactionIconBadge = {
  badgeIcon?: Icons.IconComponentType
  badgeBg?: Color
}

type TransactionAvatar = TransactionIcon & TransactionIconBadge & { isReversed: boolean }

const getCardPaymentIcon = (transaction: TransactionDto) => {
  const { logo, category, merchant } = transaction

  if (logo) {
    return { image: `https://assets.revolut.com/merchant_icons/${logo}@2x.png` }
  }

  if (merchant?.logo) {
    return { image: merchant.logo }
  }

  switch (category) {
    case TransactionCategory.Services:
      return { icon: Icons.Services }
    case TransactionCategory.Travel:
      return { icon: Icons.Travel }
    case TransactionCategory.Transport:
      return { icon: Icons.Transport }
    case TransactionCategory.Health:
      return { icon: Icons.Health }
    case TransactionCategory.Utilities:
      return { icon: Icons.Utilities }
    case TransactionCategory.Entertainment:
      return { icon: Icons.Entertainment }
    case TransactionCategory.Shopping:
      return { icon: Icons.Shopping }
    case TransactionCategory.Groceries:
      return { icon: Icons.Groceries }
    case TransactionCategory.Restaurants:
      return { icon: Icons.Restaurants }
    default:
      return { icon: Icons.Shopping }
  }
}

/**
 * Please see:
 * revolut-android/app_retail/app/src/main/java/com/revolut/ui/account/resources/impl/TransactionIconResourcesMapperImpl.kt#getIcon
 */
const getIcon = (transaction: TransactionDto): TransactionIcon => {
  const { type, description } = transaction

  if (
    (transactionPropertyChecker.isDeclinedOrFailed(transaction) &&
      !transactionPropertyChecker.isSuspicious(transaction)) ||
    transactionPropertyChecker.isReverted(transaction)
  ) {
    return { icon: Icons.Reverted }
  }

  if (
    transactionPropertyChecker.investmentAccountFund(transaction) ||
    transactionPropertyChecker.investmentAccountWithdraw(transaction)
  ) {
    return { icon: Icons.Wealth }
  }

  if (
    transactionPropertyChecker.isLoungePasses(transaction) &&
    type === TransactionType.Fee
  ) {
    return { icon: Icons.Lounges }
  }

  switch (type) {
    case TransactionType.Atm:
      return { icon: Icons.Cash }
    case TransactionType.CardPayment: {
      return getCardPaymentIcon(transaction)
    }
    case TransactionType.TopupReturn:
    case TransactionType.Refund:
    case TransactionType.CardRefund:
      return { icon: Icons.Refund }
    case TransactionType.Exchange:
      return { icon: Icons.ActionExchange }
    case TransactionType.Fee:
      return { icon: Icons.LogoRevolut }
    case TransactionType.Reward:
      if (description === METAL_CASHBACK_DESCRIPTION) {
        return { icon: Icons.Safe }
      }

      return { icon: Icons.Gift }
    case TransactionType.Topup:
    case TransactionType.TopupChargeback:
      return { icon: Icons.ActionTopUp }
    case TransactionType.Transfer:
      return { icon: Icons.ArrowSend }
    case TransactionType.Trade:
      return { icon: Icons.Wealth }
    case TransactionType.CreditInterest:
      return { icon: Icons.Percent }
    case TransactionType.Loan:
    case TransactionType.LoanPayoff:
    case TransactionType.LoanPayment:
      return { icon: Icons.Credit }
    case TransactionType.Cashback:
      return { icon: Icons.Gift }
    default:
      return { icon: Icons.Unknown }
  }
}

export const getIconBadge = (
  transaction: TransactionDto,
  isSuspiciousTransferFeatureActive: boolean = false, // TODO: remove after 100% deploy of suspicious transfer
): TransactionIconBadge => {
  if (transactionPropertyChecker.isSuspicious(transaction)) {
    return {
      badgeIcon: Icons.ExclamationMarkSign,
      badgeBg: Color.WARNING,
    }
  }

  if (
    isSuspiciousTransferFeatureActive && // TODO: remove after 100% deploy of suspicious transfer
    TransactionStatusReasonCodes.SuspiciousTransactionUserActionRequired ===
      transaction.reason
  ) {
    return {
      badgeIcon: Icons.ExclamationMarkSign,
      badgeBg: Color.WARNING,
    }
  }

  if (transactionPropertyChecker.isPending(transaction)) {
    return {
      badgeIcon: Icons.StatusClockArrows,
      badgeBg: Color.WARNING,
    }
  }

  if (transactionPropertyChecker.hasErrorStatus(transaction)) {
    return {
      badgeIcon: Icons.Cross,
      badgeBg: Color.ERROR,
    }
  }

  return {}
}

const getIsReversed = (transaction: TransactionDto): boolean =>
  transactionPropertyChecker.isIncoming(transaction)

export const getAvatar = (
  transaction: TransactionDto,
  isSuspiciousTransferFeatureActive: boolean = false, // TODO: remove after 100% deploy of suspicious transfer
): TransactionAvatar => ({
  isReversed: getIsReversed(transaction),
  ...getIcon(transaction),
  ...getIconBadge(transaction, isSuspiciousTransferFeatureActive),
})
