import { FC } from 'react'
import { Box, TextProps } from '@revolut/ui-kit'

import { formatMoney, getCurrentIntlLocale } from '@revolut/rwa-core-utils'

import { StyledText } from './styled'

type MoneyLabelProps = {
  isGrey?: boolean
  isStrikethru: boolean
  withSign: boolean
  currency?: string
  amount: number
  fontSize?: string
  textProps?: TextProps
}

const getAmountPrefix = (amount: number) => {
  if (amount > 0) {
    return '+ '
  }

  if (amount < 0) {
    return '- '
  }

  return ''
}

export const MoneyLabel: FC<MoneyLabelProps> = ({
  isGrey,
  isStrikethru,
  withSign,
  currency,
  amount,
  fontSize,
  textProps = {},
  ...props
}) => {
  const locale = getCurrentIntlLocale()
  const amountPrefix = getAmountPrefix(amount)

  return currency ? (
    <Box {...props}>
      <StyledText
        color={isGrey ? 'grey-50' : 'black'}
        fontSize={fontSize}
        isStrikethru={isStrikethru}
        {...textProps}
      >
        {`${amountPrefix}${formatMoney(Math.abs(amount), currency, locale)}`}
      </StyledText>
    </Box>
  ) : null
}
