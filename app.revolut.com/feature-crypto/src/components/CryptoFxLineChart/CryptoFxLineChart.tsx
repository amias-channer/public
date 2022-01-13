import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { FxLineChart } from '@revolut/rwa-core-components'
import { Currency } from '@revolut/rwa-core-types'

import { CurrentExchangeRate } from '../../types'

type Props = {
  baseCurrency: Currency
  chartHeight?: number
  exchangeRate?: CurrentExchangeRate
  reversed?: boolean
  targetCurrency: Currency
}

export const CryptoFxLineChart: FC<Props> = ({
  baseCurrency,
  chartHeight,
  exchangeRate,
  reversed,
  targetCurrency,
}) => {
  const { t } = useTranslation('components.CryptoFxLineChart')

  return (
    <FxLineChart
      baseCurrency={baseCurrency}
      chartHeight={chartHeight}
      currenciesPairSeparator="/"
      exchangeRate={exchangeRate}
      maximumFractionDigits={8}
      note={t('disclaimer.text')}
      reversed={reversed}
      targetCurrency={targetCurrency}
    />
  )
}
