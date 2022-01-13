import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '@revolut/ui-kit'

import { useQueryWallet } from '@revolut/rwa-core-api'
import { MoneyInput } from '@revolut/rwa-core-components'
import { useLocale } from '@revolut/rwa-core-i18n'
import { checkRequired, formatMoney } from '@revolut/rwa-core-utils'
import { AssetsQuoteFeeDto, PocketType } from '@revolut/rwa-core-types'

import { ExchangeFee } from '../../../../components'
import { CryptoExchangeMethod } from '../../../../types'
import { BUY_CURRENCY_SYMBOL, SELL_CURRENCY_SYMBOL, I18N_NAMESPACE } from '../constants'
import { checkIsCryptoBuyMethod, getInputErrorMessage } from '../utils'

type Props = {
  currencyCode: string
  errorMessage?: string
  cryptoExchangeMethod: CryptoExchangeMethod
  fee?: AssetsQuoteFeeDto
  lowerLimit?: number
  upperLimit?: number
  value?: number
  onChange: (value?: number) => void
  onCurrencyClick: VoidFunction
  onError: (message?: string) => void
  onFeeClick: VoidFunction
  onFocus: VoidFunction
}

export const FIAT_CURRENCY_INPUT_TEST_ID = 'fiat-currency-input'

export const FiatCurrencyInput = forwardRef<HTMLDivElement, Props>(
  (
    {
      currencyCode,
      errorMessage,
      cryptoExchangeMethod,
      fee,
      lowerLimit,
      upperLimit,
      value,
      onChange,
      onCurrencyClick,
      onError,
      onFeeClick,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation(I18N_NAMESPACE)

    const { locale } = useLocale()
    const { data: wallet } = useQueryWallet()

    const [pocketBalance, setPocketBalance] = useState<string>()

    const isFiatBuyMethod = !checkIsCryptoBuyMethod(cryptoExchangeMethod)

    useEffect(() => {
      if (!wallet) {
        return
      }

      const { pockets } = wallet

      const selectedPocket = checkRequired(
        pockets.find(
          (pocket) =>
            pocket.currency === currencyCode && pocket.type === PocketType.Current,
        ),
        `pocket ${currencyCode} can not be undefined`,
      )

      const pocketBalanceAmount = selectedPocket.balance
      setPocketBalance(formatMoney(pocketBalanceAmount, selectedPocket.currency, locale))

      onError(
        getInputErrorMessage({
          t,
          formattedLowerLimit: formatMoney(
            lowerLimit ?? 0,
            selectedPocket.currency,
            locale,
          ),
          lowerLimit,
          upperLimit,
          balanceAmount: pocketBalanceAmount,
          isCurrencyBuyMethod: isFiatBuyMethod,
          value,
        }),
      )
    }, [
      currencyCode,
      isFiatBuyMethod,
      locale,
      lowerLimit,
      onError,
      t,
      upperLimit,
      value,
      wallet,
    ])

    const hasErrorMessage = Boolean(errorMessage)

    const inputPrefix = isFiatBuyMethod ? BUY_CURRENCY_SYMBOL : SELL_CURRENCY_SYMBOL

    const message =
      errorMessage ||
      (fee && (
        <ExchangeFee
          isBuyMethod={isFiatBuyMethod}
          totalFee={fee.total}
          onClick={onFeeClick}
        />
      ))

    return (
      <Amount ref={ref} aria-invalid={hasErrorMessage} {...props}>
        <Amount.Currency
          value={currencyCode}
          message={t('CryptoExchange.pocketBalance', { amount: pocketBalance })}
          onClick={onCurrencyClick}
        />
        <Amount.Input
          data-testid={FIAT_CURRENCY_INPUT_TEST_ID}
          use={MoneyInput}
          border={false}
          hasError={hasErrorMessage}
          size="compact"
          variant="underlined"
          value={value}
          currency={currencyCode}
          prefix={inputPrefix}
          withCurrencySymbol
          message={message}
          // @ts-ignore
          onChange={onChange}
          onFocus={onFocus}
        />
      </Amount>
    )
  },
)
