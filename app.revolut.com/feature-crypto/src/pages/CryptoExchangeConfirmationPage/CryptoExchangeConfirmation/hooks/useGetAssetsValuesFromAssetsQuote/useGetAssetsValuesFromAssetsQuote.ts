import { AssetsQuoteResponseDto, AssetsQuoteType } from '@revolut/rwa-core-types'
import {
  checkRequired,
  convertCurrencyToMonetaryUnits,
  formatMoney,
  formatWealthAmount,
} from '@revolut/rwa-core-utils'
import { useLocale } from '@revolut/rwa-core-i18n'

export const useGetAssetsValuesFromAssetsQuote = ({
  assetsQuote,
  cryptoCode,
  fiatCurrencyCode,
}: {
  assetsQuote?: AssetsQuoteResponseDto
  cryptoCode: string
  fiatCurrencyCode: string
}) => {
  const { locale } = useLocale()

  let fiatValue = ''
  let cryptoValue = ''

  if (!assetsQuote) {
    return {
      fiatValue,
      cryptoValue,
    }
  }

  const amountAfterFees = checkRequired(
    assetsQuote.toAmountAfterFees || assetsQuote.fromAmountAfterFees,
    'one of amount after fees should be available',
  )

  if (amountAfterFees.assetType === AssetsQuoteType.Fiat) {
    const cryptoAmount =
      assetsQuote.fromAmount.assetType === AssetsQuoteType.Crypto
        ? assetsQuote.fromAmount
        : assetsQuote.toAmount

    fiatValue = formatMoney(
      checkRequired(
        convertCurrencyToMonetaryUnits(fiatCurrencyCode, Number(amountAfterFees.value)),
      ),
      fiatCurrencyCode,
      locale,
    )

    cryptoValue = formatWealthAmount(cryptoAmount.value, cryptoCode)
  } else {
    const fiatAmount =
      assetsQuote.fromAmount.assetType === AssetsQuoteType.Fiat
        ? assetsQuote.fromAmount
        : assetsQuote.toAmount

    cryptoValue = formatWealthAmount(amountAfterFees.value, cryptoCode)

    fiatValue = formatMoney(
      checkRequired(
        convertCurrencyToMonetaryUnits(fiatCurrencyCode, Number(fiatAmount.value)),
      ),
      fiatCurrencyCode,
      locale,
    )
  }

  return {
    fiatValue,
    cryptoValue,
  }
}
