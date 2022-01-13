import { FC } from 'react'
import { isUndefined } from 'lodash'
import { Box, Flex } from '@revolut/ui-kit'

import { useLocale } from '@revolut/rwa-core-i18n'
import { Currency } from '@revolut/rwa-core-types'
import { formatMoney, CurrencyDisplay, SignDisplay } from '@revolut/rwa-core-utils'

import { Percents } from '../Percents'

type Props = {
  pnl: number
  currency: Currency
  performance: number
  maximumFractionDigits?: number
}

const MONEY_FORMATTING_OPTIONS = {
  withCurrency: true,
  useGrouping: true,
  noDecimal: false,
  signDisplay: SignDisplay.Auto,
  currencyDisplay: CurrencyDisplay.Symbol,
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
}

export const RatePerformance: FC<Props> = ({
  pnl,
  currency,
  performance,
  maximumFractionDigits,
}) => {
  const { locale } = useLocale()

  let pnlSign = ''
  if (pnl > 0) {
    pnlSign = '+'
  } else if (pnl < 0) {
    pnlSign = '-'
  }

  const showPnl = `${pnlSign}${formatMoney(Math.abs(pnl), currency, locale, {
    ...MONEY_FORMATTING_OPTIONS,
    maximumFractionDigits: isUndefined(maximumFractionDigits)
      ? MONEY_FORMATTING_OPTIONS.maximumFractionDigits
      : maximumFractionDigits,
  })}`

  return (
    <Flex>
      <Box mr="s-8">{showPnl}</Box>
      <Percents value={performance} />
    </Flex>
  )
}
