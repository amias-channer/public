import React, { ChangeEvent, FC, useCallback, useState } from 'react'
import Infinite from 'react-infinite'
import { Amount, CurrencyCode, Group, Item, Popup, Search, Sticky } from '@revolut/ui-kit'

import { Currency, MoneyInputItem, MoneyValue } from '../../../types'
import { useWidgetInputVariant } from '../../../providers'
import { includesSubstringCaseInsensitive } from '../../helpers'
import useScrollToRef from '../../useScrollToRef'
import { FALLBACK_CURRENCIES } from '../common/constants/fallbackCurrencies'
import CountryFlag from '../common/CountryFlag/CountryFlag'
import { useDebouncedSearch } from '../common/hooks/useDebouncedSearch'
import { StyledAmountInput } from './styled'
import {
  getCurrencyFromMoneyValue,
  moneyValueToInputValue,
  inputValueToMinorUnitAmount,
  limitDigitsAfterDecimalPoint,
} from './utils'

export const INPUT_AMOUNT_TESTID = 'input-amount-testid'
export const INPUT_CURRENCY_TESTID = 'input-currency-testid'
const DEFAULT_CURRENCY = 'AED'
const CONTAINER_HEIGHT = 530
const ELEMENT_HEIGHT = 76
const AMOUNT_REGEXP = /[^0-9.]/g

type Props = {
  value?: Partial<MoneyValue>
  currencyOptions: MoneyInputItem['currencyOptions']
  searchHint: MoneyInputItem['searchHint']
  disabled: boolean
  changeValue: (value: Partial<MoneyValue>) => void
  style?: string
  hint?: string
}

const searchCurrencies = (currencyOptions: Currency[], filterValue: string) =>
  currencyOptions.filter(
    ({ code, description }) =>
      includesSubstringCaseInsensitive(code, filterValue) ||
      (description && includesSubstringCaseInsensitive(description, filterValue)),
  )

const MoneyInput: FC<Props> = ({
  value = { currency: DEFAULT_CURRENCY },
  currencyOptions = FALLBACK_CURRENCIES,
  searchHint,
  disabled,
  changeValue,
  hint = '',
  style = '',
}) => {
  const inputVariant = useWidgetInputVariant()
  const amountVariant = inputVariant === 'grey' ? 'grey' : 'white'
  const currency = getCurrencyFromMoneyValue(value, currencyOptions)
  const [amount, setAmount] = useState<string>(moneyValueToInputValue(value, currency))
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const { ref, scroll } = useScrollToRef()

  const { filterInputValue, filteredItems, debouncedSearch } = useDebouncedSearch<
    Currency
  >(currencyOptions, searchCurrencies)

  const handleChangeCurrency = useCallback(
    (newCurrency: CurrencyCode) => {
      changeValue({ currency: newCurrency, amount: value?.amount })
    },
    [changeValue, value],
  )

  const handleChangeAmount = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawAmountValue = event.target.value.replace(AMOUNT_REGEXP, '')
      const amountValue = limitDigitsAfterDecimalPoint(rawAmountValue, currency)
      setAmount(amountValue)
      const minorUnitAmount = inputValueToMinorUnitAmount(amountValue, currency)
      changeValue({ currency: value?.currency, amount: minorUnitAmount })
    },
    [changeValue, currency, value],
  )

  return (
    <>
      <Amount ref={ref} variant={amountVariant}>
        <Amount.Currency
          data-testid={INPUT_CURRENCY_TESTID}
          value={value?.currency}
          disabled={disabled}
          {...(style === 'WITHOUT_CURRENCY_CODE'
            ? {}
            : { onClick: () => setIsPopupOpen(true) })}
        />
        <StyledAmountInput
          data-testid={INPUT_AMOUNT_TESTID}
          value={amount}
          placeholder={hint}
          maxLength={16}
          disabled={disabled}
          onChange={handleChangeAmount}
          onFocus={() => scroll()}
        />
      </Amount>
      <Popup
        isOpen={isPopupOpen}
        variant="modal-view"
        onExit={() => setIsPopupOpen(false)}
      >
        <Sticky mb="s-24" zIndex={1}>
          <Search
            value={filterInputValue}
            placeholder={searchHint || 'Search currency'}
            onChange={debouncedSearch}
          />
        </Sticky>
        <Group>
          <Infinite containerHeight={CONTAINER_HEIGHT} elementHeight={ELEMENT_HEIGHT}>
            {filteredItems.map(({ code, countryCode, description }) => (
              <Item
                key={code}
                use="button"
                onClick={() => {
                  handleChangeCurrency(code)
                  setIsPopupOpen(false)
                }}
                style={{ cursor: 'pointer' }}
              >
                <Item.Avatar>
                  <CountryFlag countryCode={countryCode} />
                </Item.Avatar>
                <Item.Content>
                  <Item.Title>{description}</Item.Title>
                  <Item.Description>{code}</Item.Description>
                </Item.Content>
              </Item>
            ))}
          </Infinite>
        </Group>
      </Popup>
    </>
  )
}

export default MoneyInput
