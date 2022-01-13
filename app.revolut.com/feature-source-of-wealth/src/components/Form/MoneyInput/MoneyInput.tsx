import { FC, useState } from 'react'
import { Amount, AmountInputProps, Group, Popup, Item } from '@revolut/ui-kit'

import {
  FormFieldGenericProps,
  MoneyInput as CoreMoneyInput,
  MoneyInputValue,
  CountryFlag,
} from '@revolut/rwa-core-components'
import { Currency, CurrencyProperties } from '@revolut/rwa-core-types'

type MoneyInput = {
  message?: string
  currency: Currency
  currencyOptions: CurrencyProperties[]
  onCurrencyChange: (value: string) => void
} & FormFieldGenericProps &
  AmountInputProps

export const MoneyInput: FC<MoneyInput> = ({
  currency,
  currencyOptions,
  onCurrencyChange,
  message,
  onChange,
  error,
  isTouched,
  isErrorShown = true,
  value,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const handleChange = (passedValue: MoneyInputValue) => {
    onChange(passedValue)
  }

  return (
    <>
      <Amount>
        <Amount.Currency value={currency} onClick={() => setIsPopupOpen(true)} />
        <Amount.Input
          use={CoreMoneyInput}
          border={false}
          autoComplete="off"
          placeholder="0"
          variant="underlined"
          size="compact"
          currency={currency}
          withCurrencySymbol
          message={isTouched && isErrorShown ? error : message}
          hasError={isErrorShown && Boolean(error)}
          onChange={handleChange}
          value={value}
        />
      </Amount>
      <Popup
        isOpen={isPopupOpen}
        variant="bottom-sheet"
        onExit={() => setIsPopupOpen(false)}
      >
        <Group>
          {currencyOptions.map((item) => (
            <Item
              key={item.code}
              use="button"
              onClick={() => {
                onCurrencyChange(item.code)
                setIsPopupOpen(false)
              }}
            >
              <Item.Avatar>
                <CountryFlag country={item.country} />
              </Item.Avatar>
              <Item.Content>
                <Item.Title>{item.code}</Item.Title>
                <Item.Description>{item.currency}</Item.Description>
              </Item.Content>
            </Item>
          ))}
        </Group>
      </Popup>
    </>
  )
}
