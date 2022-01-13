import { TransactionDto, TransactionType } from '@revolut/rwa-core-types'
import {
  localization,
  checkIfCryptoCurrency,
  checkRequired,
} from '@revolut/rwa-core-utils'

import * as transactionPropertyChecker from './transactionPropertyChecker'

const getLocalizedDescription = (transaction: TransactionDto) => {
  const { localisedDescription } = transaction
  if (!localisedDescription || !localisedDescription.key) {
    return null
  }

  if (
    localisedDescription.key &&
    localisedDescription.params &&
    localisedDescription?.params?.length
  ) {
    return localization.getStringWithParamsArray(
      localisedDescription.key,
      localisedDescription.params,
    )
  }

  return localization.getString(localisedDescription.key)
}

const getLocalizationStringForTransactionType = (transaction: TransactionDto) => {
  switch (transaction.type) {
    case TransactionType.Topup:
      return 'transaction-top_up'
    case TransactionType.TopupReturn:
      return 'transaction-top_up-return'
    case TransactionType.TopupChargeback:
      return 'transaction-top_up-chargeback'
    case TransactionType.Transfer:
      return 'top_up-transfer-form-transfer'
    case TransactionType.Atm:
      return 'transaction-atm_withdrawal'
    case TransactionType.CardPayment:
      return 'transaction-card_payment'
    case TransactionType.Exchange:
      return 'transaction-exchange'
    case TransactionType.Reward:
      return 'transaction-reward'
    case TransactionType.Fee:
      return 'transaction-fee'
    case TransactionType.Refund:
    case TransactionType.CardRefund:
      return 'transaction-refund'

    default:
      return 'transaction-unknown'
  }
}

const getMerchantTitle = (transaction: TransactionDto) => {
  return (
    transaction?.merchant?.name ||
    transaction.description ||
    localization.getString(getLocalizationStringForTransactionType(transaction))
  )
}

const getStandardExchangeTitle = (transaction: TransactionDto) => {
  // counterpart currency was checked in checkIfExchange
  const transactionCounterPartCurrency = checkRequired(transaction.counterpart?.currency)

  if (checkIfCryptoCurrency(transactionCounterPartCurrency)) {
    if (transaction.direction === 'buy') {
      return localization.getString('transaction-sold_to-title', {
        baseCurrency: transactionCounterPartCurrency,
        targetCurrency: transaction.currency,
      })
    }

    return localization.getString('transaction-bought_with-title', {
      baseCurrency: transaction.currency,
      targetCurrency: transactionCounterPartCurrency,
    })
  }

  if (transaction.direction === 'sell') {
    return localization.getString('transaction-sold_to-title', {
      baseCurrency: transaction.currency,
      targetCurrency: transactionCounterPartCurrency,
    })
  }

  return localization.getString('transaction-bought_with-title', {
    baseCurrency: transactionCounterPartCurrency,
    targetCurrency: transaction.currency,
  })
}

const getLoungesFeeTitle = (transaction: TransactionDto) => {
  const isOnlyOnePass = transaction.loungePassIds?.length === 1
  const isFreePass = isOnlyOnePass && transaction.amount === 0
  if (isFreePass) {
    return localization.getString('airport_lounges-transaction-title_free')
  }
  if (isOnlyOnePass) {
    return localization.getString('airport_lounges-transaction-title_single')
  }
  return localization.getString(
    'airport_lounges-transaction-title_multiple',
    transaction.loungePassIds?.length,
  )
}

export const getTransactionTitle = (transaction: TransactionDto) => {
  const localisedDescription = getLocalizedDescription(transaction)
  if (transaction.type === TransactionType.CreditInterest) {
    return localization.getString('credit-transaction-interest_charges-title')
  }

  if (transaction.type === TransactionType.Refund) {
    return localization.getString('transactions-transfer-refund-title')
  }

  if (transactionPropertyChecker.isAutoCreditCardTopup(transaction)) {
    if (transactionPropertyChecker.isCredit(transaction)) {
      return localization.getString('credit-transaction-auto_credit_card_topup-title')
    }
    return localization.getString('credit-transaction-auto_topup_to_credit_card-title')
  }

  if (transactionPropertyChecker.isCreditCardExcessBalanceTransfer(transaction)) {
    return localization.getString('credit-transaction-excess_balance_transfer-title')
  }

  if (transactionPropertyChecker.isCreditPayment(transaction)) {
    return localization.getString('credit-transaction-credit_card_topup-title')
  }

  if (transactionPropertyChecker.isCreditCardTopup(transaction)) {
    return localization.getString('credit-transaction-topup_to_credit_card-title')
  }

  if (transactionPropertyChecker.checkIfExchange(transaction)) {
    return getStandardExchangeTitle(transaction)
  }

  if (localisedDescription) {
    return {
      key: localisedDescription.key.replace(/\./g, '-'),
      param: localisedDescription.param,
    }
  }

  if (transactionPropertyChecker.tfl(transaction)) {
    if (transaction.type !== TransactionType.CardPayment) {
      return (
        transaction.description ||
        localization.getString('transactions-transport-tfl-refund-title')
      )
    }
    return localization.getString('transactions-transport-tfl-title')
  }

  if (
    transaction.type === TransactionType.Transfer &&
    transaction.transferLinkId != null &&
    transaction.description
  ) {
    return localization.getString('transactions-bylink-title')
  }

  // to be added

  // if (transaction.type === TransactionType.ATM) {
  //   const merchantTitle = getMerchantTitle(transaction)
  //   return localization.getString(
  //     'transaction_description_atm',
  //     merchantTitle,
  //   )
  // }

  if (transaction.type === TransactionType.CardPayment) {
    return getMerchantTitle(transaction)
  }

  if (transaction.type === TransactionType.TopupReturn) {
    return localization.getString('transaction-top_up-return')
  }

  if (transactionPropertyChecker.investmentAccountFund(transaction)) {
    return localization.getString('wealth-transaction_title_fund')
  }

  if (transactionPropertyChecker.investmentAccountWithdraw(transaction)) {
    return localization.getString('wealth-transaction_title_withdraw')
  }

  if (transaction.type === TransactionType.TopupChargeback) {
    return localization.getString('transaction-top_up-chargeback')
  }

  if (
    transaction.type === TransactionType.Topup &&
    transactionPropertyChecker.androidPay(transaction)
  ) {
    return localization.getString('transaction-top_up_via_pay')
  }

  if (
    transaction.type === TransactionType.Topup &&
    transactionPropertyChecker.googlePay(transaction)
  ) {
    return localization.getString('transaction-top_up_via_google_pay')
  }

  if (
    transaction.type === TransactionType.Topup &&
    transactionPropertyChecker.applePay(transaction)
  ) {
    return localization.getString('transaction-top_up_via_apple_pay')
  }

  if (transaction.type === TransactionType.Transfer && transaction.cashbackBoxId) {
    return localization.getString('cashback_box-transaction_list-transfer_title')
  }

  if (transaction.type === TransactionType.Reward && transaction.cashbackBoxId) {
    return localization.getString('cashback_box-transaction_list-name')
  }

  if (
    transaction.type === TransactionType.Fee &&
    transaction.loungePassIds &&
    transaction.loungePassIds.length
  ) {
    return getLoungesFeeTitle(transaction)
  }

  return getMerchantTitle(transaction)
}
