import { useContext, useEffect, useState } from 'react'

import { MoneyInputValue } from '@revolut/rwa-core-components'
import { checkRequired, convertCurrencyToMonetaryUnits } from '@revolut/rwa-core-utils'
import {
  AssetsLimitType,
  AssetsQuoteFeeDto,
  AssetsQuoteType,
} from '@revolut/rwa-core-types'

import { CryptoExchangeMethod } from '../../../../../types'
import { useCryptoPeriodicalAssetsQuote } from '../../../../../hooks'
import { CryptoExchangeContext } from '../../../../../providers'
import { extractFinalRate } from '../../../../../utils'
import { convertOptionalMonetaryToCurrencyUnits, getCurrencyLimit } from './utils'

type Args = {
  cryptoCode: string
  exchangeMethod: CryptoExchangeMethod
  fiatCurrencyCode: string
}

const DEFAULT_RATE = 0
const DEFAULT_ASSETS_QUOTE_AMOUNT = 0

const checkFeeType = (fee: AssetsQuoteFeeDto | undefined, assetType: AssetsQuoteType) =>
  fee?.total.assetType === assetType

export const useExchangeInputs = ({
  cryptoCode,
  exchangeMethod,
  fiatCurrencyCode,
}: Args) => {
  const [isCryptoInputFocused, setCryptoInputFocused] = useState(true)
  const [cryptoValue, setCryptoValue] = useState<number>()
  const [fiatValue, setFiatValue] = useState<number>()
  const [cryptoErrorMessage, setCryptoErrorMessage] = useState<string>()
  const [fiatErrorMessage, setFiatErrorMessage] = useState<string>()

  const { setCryptoExchangeParams } = useContext(CryptoExchangeContext)

  const assetsQuoteAmount =
    (isCryptoInputFocused
      ? cryptoValue
      : convertOptionalMonetaryToCurrencyUnits(fiatCurrencyCode, fiatValue)) ??
    DEFAULT_ASSETS_QUOTE_AMOUNT

  const { assetsQuote } = useCryptoPeriodicalAssetsQuote({
    exchangeMethod,
    fiatCurrencySymbol: fiatCurrencyCode,
    cryptoCurrencySymbol: cryptoCode,
    amount: assetsQuoteAmount,
    isCryptoInputFocused,
  })

  useEffect(() => {
    if (!assetsQuote) {
      return
    }

    const amountAfterFees = checkRequired(
      assetsQuote.toAmountAfterFees || assetsQuote.fromAmountAfterFees,
      'one of amount after fees should be available',
    )

    const amountAfterFeesValue = parseFloat(amountAfterFees.value)

    if (amountAfterFees.assetType === AssetsQuoteType.Fiat) {
      setFiatValue(
        amountAfterFeesValue > 0
          ? convertCurrencyToMonetaryUnits(fiatCurrencyCode, amountAfterFeesValue)
          : undefined,
      )
    } else {
      setCryptoValue(amountAfterFeesValue > 0 ? amountAfterFeesValue : undefined)
    }
  }, [assetsQuote, fiatCurrencyCode])

  const handleCryptoInputChange = (amount?: number) => {
    setCryptoValue(amount)
  }

  const handleFiatInputChange = (value?: MoneyInputValue) => {
    setFiatValue(value ? Number(value) : undefined)
  }

  const handleCryptoInputFocus = () => {
    setCryptoInputFocused(true)
  }

  const handleFiatInputFocus = () => {
    setCryptoInputFocused(false)
  }

  const handleSaveExchangeData = () => {
    setCryptoExchangeParams({
      exchangeMethod,
      fiatCurrencySymbol: fiatCurrencyCode,
      cryptoCurrencySymbol: cryptoCode,
      amount: assetsQuoteAmount,
      isCryptoInputFocused,
    })
  }

  const assetsQuoteLowerLimit = assetsQuote?.limits?.find(
    (limit) => limit.type === AssetsLimitType.LowerRestriction,
  )

  const assetsQuoteUpperLimit = assetsQuote?.limits?.find(
    (limit) => limit.type === AssetsLimitType.UpperRestriction,
  )

  const cryptoLowerLimit = getCurrencyLimit(AssetsQuoteType.Crypto, assetsQuoteLowerLimit)
  const cryptoUpperLimit = getCurrencyLimit(AssetsQuoteType.Crypto, assetsQuoteUpperLimit)

  const fiatLowerLimit = getCurrencyLimit(AssetsQuoteType.Fiat, assetsQuoteLowerLimit)
  const fiatUpperLimit = getCurrencyLimit(AssetsQuoteType.Fiat, assetsQuoteUpperLimit)

  const isFiatFee = checkFeeType(assetsQuote?.fee, AssetsQuoteType.Fiat)
  const isCryptoFee = checkFeeType(assetsQuote?.fee, AssetsQuoteType.Crypto)

  const providedAmount = assetsQuote?.fromAmountAfterFees
    ? assetsQuote?.toAmount
    : assetsQuote?.fromAmount

  const exchangedAmountWithoutFees = assetsQuote?.fromAmountAfterFees
    ? assetsQuote?.fromAmount
    : assetsQuote?.toAmount

  return {
    assetsQuoteAmount,
    cryptoErrorMessage,
    cryptoFee: isCryptoFee ? assetsQuote?.fee : undefined,
    cryptoLowerLimit,
    cryptoUpperLimit,
    cryptoValue,
    exchangedAmountWithoutFees,
    fiatFee: isFiatFee ? assetsQuote?.fee : undefined,
    fiatErrorMessage,
    fiatLowerLimit,
    fiatUpperLimit,
    fiatValue,
    fromAmountAfterFees: assetsQuote?.fromAmountAfterFees,
    isCryptoInputFocused,
    providedAmount,
    rate: assetsQuote ? extractFinalRate(assetsQuote) : DEFAULT_RATE,
    rateTimestamp: assetsQuote ? assetsQuote.timestamp : 0,
    toAmountAfterFees: assetsQuote?.toAmountAfterFees,
    onCryptoInputChange: handleCryptoInputChange,
    onCryptoInputError: setCryptoErrorMessage,
    onCryptoInputFocus: handleCryptoInputFocus,
    onFiatInputChange: handleFiatInputChange,
    onFiatInputError: setFiatErrorMessage,
    onFiatInputFocus: handleFiatInputFocus,
    onReviewClick: handleSaveExchangeData,
  }
}
