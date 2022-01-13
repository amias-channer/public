import { FC, MouseEventHandler, ReactNode } from 'react'
import { Item, Text } from '@revolut/ui-kit'

import { useLocaleFormatMoney } from '@revolut/rwa-core-i18n'
import { Currency } from '@revolut/rwa-core-types'

import { CurrencyItemAvatar } from './CurrencyItemAvatar'

type Props = {
  title: string
  currency: Currency
  onClick: MouseEventHandler<HTMLDivElement>
  isSelected?: boolean
  avatar?: ReactNode
  amount?: number
  isInactive?: boolean
}

export const CurrencyItem: FC<Props> = ({
  title,
  currency,
  isSelected,
  onClick,
  amount,
  isInactive,
  avatar,
}) => {
  const formatMoney = useLocaleFormatMoney()

  const avatarComponent = avatar ?? (
    <CurrencyItemAvatar currency={currency} selected={isSelected} />
  )

  return (
    <Item use="button" onClick={onClick} aria-pressed={isSelected} disabled={isInactive}>
      <Item.Avatar>{avatarComponent}</Item.Avatar>
      <Item.Content>
        <Item.Title>
          <Text whiteSpace="nowrap" ellipsis title={title}>
            {title}
          </Text>
        </Item.Title>
        <Item.Description>{currency}</Item.Description>
      </Item.Content>
      <Item.Side>
        {amount && amount > 0 && <Item.Value>{formatMoney(amount, currency)}</Item.Value>}
      </Item.Side>
    </Item>
  )
}
