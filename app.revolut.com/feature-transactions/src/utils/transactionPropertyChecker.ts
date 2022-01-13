import {
  TransactionDto,
  TransactionType,
  TransactionStatusReasonCodes,
  PocketType,
  FraudState,
  TransactionState,
  TopUpEntryMode,
} from '@revolut/rwa-core-types'
import { checkIfCommodityCurrency, checkIfCryptoCurrency } from '@revolut/rwa-core-utils'

import { failedTransactionStatuses } from './constants'

export const isAutoCreditCardTopup = (transaction: TransactionDto) =>
  transaction.reason === TransactionStatusReasonCodes.CreditCardForcedMinimumRepayment
export const isCredit = (transaction: TransactionDto) =>
  transaction.account?.type === PocketType.Credit
export const isCreditCardExcessBalanceTransfer = (transaction: TransactionDto) =>
  transaction.reason === TransactionStatusReasonCodes.CreditCardExcessBalanceCorrection

export const isCreditPayment = (transaction: TransactionDto) =>
  transaction.account?.type === PocketType.Credit &&
  transaction.type === TransactionType.Transfer

export const isCreditCardTopup = (transaction: TransactionDto) =>
  transaction.reason === TransactionStatusReasonCodes.CreditCardTopup

export const tfl = (transaction: TransactionDto) => transaction.logo === 'tfl'

export const investmentAccountFund = (transaction: TransactionDto) =>
  transaction.profusion?.holdingId &&
  transaction.recipient?.account?.type === PocketType.Investment

export const investmentAccountWithdraw = (transaction: TransactionDto) =>
  transaction.profusion?.holdingId &&
  transaction.sender?.account?.type === PocketType.Investment

export const androidPay = (transaction: TransactionDto) =>
  transaction.entryMode === TopUpEntryMode.AndroidPay

export const googlePay = (transaction: TransactionDto) =>
  transaction.entryMode === TopUpEntryMode.GooglePay

export const applePay = (transaction: TransactionDto) =>
  transaction.entryMode === TopUpEntryMode.ApplePay

export const isSuspicious = (transaction: TransactionDto) =>
  transaction.fraudState === FraudState.Suspicious

export const isDeclinedOrFailed = (transaction: TransactionDto) =>
  transaction.state === TransactionState.Declined ||
  transaction.state === TransactionState.Failed

export const isTransferToBank = (transaction: TransactionDto) =>
  transaction.type === TransactionType.Transfer &&
  !transaction.transferLinkId &&
  !transaction.recipient &&
  !transaction.sender

export const checkIfCryptoExchange = (transaction: TransactionDto) => {
  const isExchange = TransactionType.Exchange
  const isCryptoCurrency = checkIfCryptoCurrency(transaction.currency)
  const isCounterpartCryptoCurrency =
    transaction?.counterpart?.currency &&
    checkIfCryptoCurrency(transaction?.counterpart?.currency)
  return (
    transaction.type === isExchange && (isCryptoCurrency || isCounterpartCryptoCurrency)
  )
}

export const checkIfCommodityExchange = (transaction: TransactionDto) => {
  const isExchange = TransactionType.Exchange
  const isCommodityCurrency = checkIfCommodityCurrency(transaction.currency)
  const isCounterpartCommodityCurrency =
    transaction?.counterpart?.currency &&
    checkIfCommodityCurrency(transaction?.counterpart?.currency)

  return (
    transaction.type === isExchange &&
    (isCommodityCurrency || isCounterpartCommodityCurrency)
  )
}

export const checkIfExchange = (transaction: TransactionDto) => {
  const isExchange = TransactionType.Exchange
  const hasCounterpartCurrency = Boolean(transaction?.counterpart?.currency)

  return transaction.type === isExchange && hasCounterpartCurrency
}

export const isCryptoOrCommodityExchange = (transaction: TransactionDto) =>
  checkIfCryptoExchange(transaction) || checkIfCommodityExchange(transaction)

export const isReverted = (transaction: TransactionDto) =>
  transaction.state === TransactionState.Reverted

export const isLoungePasses = (transaction: TransactionDto) => transaction.loungePassIds

export const isPending = (transaction: TransactionDto) =>
  transaction.state === TransactionState.Pending

export const isFailed = (transaction: TransactionDto) =>
  transaction.state === TransactionState.Failed

export const isIncoming = (transaction: TransactionDto) => {
  const { amount, type } = transaction
  return type === TransactionType.Transfer && amount > 0
}

export const hasErrorStatus = (transaction: TransactionDto) => {
  return failedTransactionStatuses.includes(transaction.state)
}
