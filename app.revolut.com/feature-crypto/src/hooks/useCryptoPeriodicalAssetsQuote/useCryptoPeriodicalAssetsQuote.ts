import { usePeriodicalAssetsQuote } from '@revolut/rwa-core-api'
import { useLocale } from '@revolut/rwa-core-i18n'
import { AssetsQuoteDirection, AssetsQuoteType, OrderType } from '@revolut/rwa-core-types'

import { CryptoExchangeMethod, CryptoExchangeParams } from '../../types'

const getAssetsQuoteParams = ({
  amount,
  cryptoCurrencySymbol,
  fiatCurrencySymbol,
  exchangeMethod,
  isCryptoInputFocused,
}: CryptoExchangeParams) => {
  const defaultParams = {
    orderType: OrderType.Market,
    amount: String(amount),
  }

  if (exchangeMethod === CryptoExchangeMethod.Buy) {
    return {
      ...defaultParams,
      fromAssetType: AssetsQuoteType.Fiat,
      fromSymbol: fiatCurrencySymbol,
      toAssetType: AssetsQuoteType.Crypto,
      toSymbol: cryptoCurrencySymbol,
      amountIn: isCryptoInputFocused
        ? AssetsQuoteDirection.To
        : AssetsQuoteDirection.From,
      baseRateAsset: AssetsQuoteDirection.To,
    }
  }

  return {
    ...defaultParams,
    fromAssetType: AssetsQuoteType.Crypto,
    fromSymbol: cryptoCurrencySymbol,
    toAssetType: AssetsQuoteType.Fiat,
    toSymbol: fiatCurrencySymbol,
    amountIn: isCryptoInputFocused ? AssetsQuoteDirection.From : AssetsQuoteDirection.To,
    baseRateAsset: AssetsQuoteDirection.From,
  }
}

export const useCryptoPeriodicalAssetsQuote = (args: CryptoExchangeParams) => {
  const { locale } = useLocale()

  const { assetsQuote, isAssetsQuoteFetching } = usePeriodicalAssetsQuote(
    getAssetsQuoteParams(args),
    locale,
  )

  return {
    assetsQuote,
    isAssetsQuoteFetching,
  }
}
