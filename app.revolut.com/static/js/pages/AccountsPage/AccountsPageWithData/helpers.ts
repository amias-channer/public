import { Wallet, Pocket, Quote } from '@revolut/rwa-core-types'
import {
  checkIfIsRegularPocket,
  checkIfCryptoCurrency,
  checkRequired,
  convertCurrencyToMonetaryUnits,
  convertMonetaryToCurrencyUnits,
} from '@revolut/rwa-core-utils'

import { PocketConvertedForDisplay } from '../types'

export const getWalletBaseCurrency = (wallet: Wallet) => wallet?.baseCurrency || null

const convertPocketForDisplay = (pocket: Pocket): PocketConvertedForDisplay => {
  return {
    amount: pocket.balance,
    currency: pocket.currency,
    disabled: pocket.closed,
    id: pocket.id,
    state: pocket.state,
  }
}

export const getPocketsConvertedForDisplayFromWallet = (
  wallet: Wallet,
): PocketConvertedForDisplay[] => {
  const { pockets } = wallet

  if (pockets && pockets.length > 0) {
    return pockets.filter(checkIfIsRegularPocket).map(convertPocketForDisplay)
  }

  return []
}

export const getCurrenciesForQuotesRequest = (
  wallet: Wallet,
  selectedCurrency: string,
) => {
  if (wallet && wallet.pockets) {
    const symbols = wallet.pockets.reduce((acc: string[], pocket: Pocket) => {
      if (pocket.currency !== selectedCurrency) {
        const currency = checkIfCryptoCurrency(pocket.currency)
          ? `${pocket.currency}/`
          : pocket.currency
        acc.push(currency + selectedCurrency)

        return acc
      }

      return acc
    }, [])

    return symbols
  }

  return null
}

const getRelevantQuoteRate = (pocket: Pocket, quotes: Quote[]) => {
  const relevantQuote = quotes.find((quote) => quote.from === pocket.currency)
  return relevantQuote?.rate
}

export const getTotalBalance = (
  wallet: Wallet,
  quotes: Quote[],
  selectedCurrency: string,
  currenciesForQuotesRequest: string[] | null,
) => {
  const getConvertedPocketBalance = (sum: Readonly<number>, pocket: Pocket) => {
    if (!checkIfIsRegularPocket(pocket)) {
      return sum
    }

    const pocketBalance = checkRequired(
      convertMonetaryToCurrencyUnits(pocket.currency, pocket.balance),
      '"pocketBalance" can not be empty',
    )

    if (pocket.currency === selectedCurrency) {
      return sum + pocketBalance
    }

    const quoteRate = checkRequired(
      getRelevantQuoteRate(pocket, quotes),
      '"quoteRate" can not be empty',
    )

    return sum + pocketBalance * quoteRate
  }

  const canBalanceBeCalculated =
    wallet &&
    wallet.pockets &&
    quotes &&
    currenciesForQuotesRequest &&
    (!currenciesForQuotesRequest.length || quotes.length)

  if (canBalanceBeCalculated) {
    const totalBalance = wallet.pockets.reduce(getConvertedPocketBalance, 0)

    return convertCurrencyToMonetaryUnits(selectedCurrency, totalBalance)
  }

  return undefined
}
