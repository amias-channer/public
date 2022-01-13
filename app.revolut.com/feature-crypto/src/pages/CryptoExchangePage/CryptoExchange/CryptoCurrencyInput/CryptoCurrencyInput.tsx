import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '@revolut/ui-kit'

import {
  checkRequired,
  convertMonetaryToCurrencyUnits,
  formatWealthAmount,
  getCurrencyInfoByCurrencyCode,
} from '@revolut/rwa-core-utils'
import { AssetsQuoteFeeDto } from '@revolut/rwa-core-types'

import { useCryptoHoldings } from '../../../../hooks'
import { CryptoExchangeMethod } from '../../../../types'
import { ExchangeFee } from '../../../../components'
import { I18N_NAMESPACE } from '../constants'
import { checkIsCryptoBuyMethod, getInputErrorMessage } from '../utils'
import { WealthQuantityInputStyled } from './styled'
import { BUY_CURRENCY_SYMBOL, SELL_CURRENCY_SYMBOL } from '../constants'

type Props = {
  cryptoCode: string
  errorMessage?: string
  exchangeMethod: CryptoExchangeMethod
  fee?: AssetsQuoteFeeDto
  fiatCurrencyCode: string
  lowerLimit?: number
  upperLimit?: number
  value?: number
  onChange: (value?: number) => void
  onError: (message?: string) => void
  onFeeClick: VoidFunction
  onFocus: VoidFunction
}

export const CRYPTO_CURRENCY_INPUT_TEST_ID = 'crypto-currency-input'

export const CryptoCurrencyInput = forwardRef<HTMLDivElement, Props>(
  (
    {
      cryptoCode,
      errorMessage,
      exchangeMethod,
      fee,
      fiatCurrencyCode,
      lowerLimit,
      upperLimit,
      value,
      onChange,
      onError,
      onFeeClick,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation(I18N_NAMESPACE)

    const { getHolding } = useCryptoHoldings(fiatCurrencyCode)

    const [cryptoBalance, setCryptoBalance] = useState<string>()

    const isCryptoBuyMethod = checkIsCryptoBuyMethod(exchangeMethod)

    useEffect(() => {
      const holdingData = getHolding(cryptoCode)

      const cryptoHolding = holdingData.value

      const cryptoBalanceAmount = checkRequired(
        convertMonetaryToCurrencyUnits(cryptoCode, cryptoHolding?.amount ?? 0),
        'crypto balance can not be undefined',
      )

      setCryptoBalance(formatWealthAmount(`${cryptoBalanceAmount}`, cryptoCode))

      onError(
        getInputErrorMessage({
          t,
          formattedLowerLimit: formatWealthAmount(`${lowerLimit}`, cryptoCode),
          lowerLimit,
          upperLimit,
          balanceAmount: cryptoBalanceAmount,
          isCurrencyBuyMethod: isCryptoBuyMethod,
          value,
        }),
      )
    }, [
      cryptoCode,
      getHolding,
      isCryptoBuyMethod,
      lowerLimit,
      onError,
      t,
      upperLimit,
      value,
    ])

    const currencyInfo = checkRequired(
      getCurrencyInfoByCurrencyCode(cryptoCode),
      'cryptoCode can not be empty',
    )

    const inputPrefix = isCryptoBuyMethod ? BUY_CURRENCY_SYMBOL : SELL_CURRENCY_SYMBOL

    const hasErrorMessage = Boolean(errorMessage)

    const message =
      errorMessage ||
      (fee && (
        <ExchangeFee
          isBuyMethod={isCryptoBuyMethod}
          totalFee={fee.total}
          onClick={onFeeClick}
        />
      ))

    return (
      <Amount use="label" ref={ref} aria-invalid={Boolean(errorMessage)} {...props}>
        <Amount.Currency
          value={cryptoCode}
          message={t('CryptoExchange.pocketBalance', { amount: cryptoBalance })}
        />
        <Amount.Input
          data-testid={CRYPTO_CURRENCY_INPUT_TEST_ID}
          autoFocus
          allowNegative={false}
          hasError={hasErrorMessage}
          use={WealthQuantityInputStyled}
          decimalScale={currencyInfo.fraction}
          prefix={value && value > 0 ? inputPrefix : undefined}
          value={value}
          message={message}
          onChange={onChange}
          onFocus={onFocus}
        />
      </Amount>
    )
  },
)
