import isNil from 'lodash/isNil'
import { FC, useContext, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Amount } from '@revolut/ui-kit'

import { MoneyInput, MoneyInputValue, useModal } from '@revolut/rwa-core-components'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import {
  CurrenciesType,
  CurrencyProperties,
  Pocket,
  TopupAmount,
} from '@revolut/rwa-core-types'
import { checkIfIsRegularPocket, checkRequired } from '@revolut/rwa-core-utils'

import { EMPTY_AMOUNT_VALUE, I18N_NAMESPACE } from '../../constants'
import { formatMoney } from '../../utils'
import { AmountSuggestions } from '../../AmountSuggestions'
import { TopUpContext } from '../../TopUpProvider'
import { SelectCurrencyPopup } from '../SelectCurrencyPopup'
import { AMOUNT_SUGGESTIONS_VALUES } from '../constants'

type AmountInputProps = {
  minAmountConfig: object
  pockets: ReadonlyArray<Pocket>
  onValidate: (isValid: boolean) => void
  shouldChangeCurrency: (currency: CurrencyProperties) => boolean
}

export const AmountInput: FC<AmountInputProps> = ({
  minAmountConfig,
  pockets,
  onValidate,
  shouldChangeCurrency,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { amount: contextAmount, setAmount, setPocketId } = useContext(TopUpContext)
  const [amountInputValue, setAmountInputValue] = useState<MoneyInputValue>(
    contextAmount?.amount,
  )
  const [showSelectCurrencyPopup, selectCurrencyPopupProps] = useModal()

  const currencies = getConfigValue<CurrenciesType>(ConfigKey.Currencies)
  const validPockets = pockets
    .filter(checkIfIsRegularPocket)
    .filter((pocket) => minAmountConfig[pocket.currency])
  const pocketsCurrenciesCodes = validPockets.map((pocket) => pocket.currency)

  const initialCurrencyCode = contextAmount?.currency || pocketsCurrenciesCodes[0]
  const [currency, setCurrency] = useState<CurrencyProperties>(
    currencies[initialCurrencyCode],
  )
  const initialAmount = useMemo<TopupAmount>(
    () => ({
      amount: EMPTY_AMOUNT_VALUE,
      currency: currency.code,
    }),
    [currency.code],
  )

  const amount = contextAmount ?? initialAmount
  const currentPocket = checkRequired(
    validPockets.find((pocket) => pocket.currency === amount.currency),
    '"currentPocket" can not be empty',
  )
  const formattedBalance = formatMoney({
    amount: currentPocket.balance,
    currency: currency.code,
  })
  const minAmount = checkRequired(
    minAmountConfig[amount.currency],
    '"minAmount" can not be empty',
  )
  const formattedMinAmount = formatMoney(
    {
      amount: minAmount,
      currency: currency.code,
    },
    true,
  )

  useEffect(() => {
    setPocketId(currentPocket.id)
  }, [currentPocket.id, setPocketId])

  useEffect(() => {
    const isAmountValid = amount.amount >= minAmount

    onValidate(isAmountValid)
  }, [amount, minAmount, onValidate])

  useEffect(() => {
    if (isNil(contextAmount)) {
      setAmount(initialAmount)
    }
  }, [initialAmount, contextAmount, setAmount])

  useEffect(() => {
    if (amount.currency !== currency.code) {
      setAmount({
        amount: amount.amount,
        currency: currency.code,
      })
    }
  }, [currency.code, amount, setAmount])

  const handleAmountInputChange = (newValue: MoneyInputValue) => {
    setAmountInputValue(newValue)
    setAmount({
      amount: (newValue ?? EMPTY_AMOUNT_VALUE) as number,
      currency: currency.code,
    })
  }

  const handleCurrencySelected = (newValue: CurrencyProperties) => {
    if (shouldChangeCurrency(newValue)) {
      setCurrency(newValue)
    }
  }

  return (
    <>
      <Amount>
        <Amount.Currency
          value={currency.code}
          message={t('TopUpAmountInput.pocketBalanceMessage', {
            balance: formattedBalance,
          })}
          onClick={showSelectCurrencyPopup}
        />
        <Amount.Input
          use={MoneyInput}
          autoFocus
          border={false}
          placeholder="0"
          variant="underlined"
          size="compact"
          currency={currency.code}
          withCurrencySymbol={false}
          value={amountInputValue}
          message={t('TopUpAmountInput.minimumAmountMessage', {
            amount: formattedMinAmount,
          })}
          onChange={handleAmountInputChange}
        />

        <AmountSuggestions
          currency={currency.code}
          availableValues={AMOUNT_SUGGESTIONS_VALUES}
          onSelect={handleAmountInputChange}
        />
      </Amount>

      <SelectCurrencyPopup
        currenciesCodes={pocketsCurrenciesCodes}
        onCurrencySelected={handleCurrencySelected}
        {...selectCurrencyPopupProps}
      />
    </>
  )
}
