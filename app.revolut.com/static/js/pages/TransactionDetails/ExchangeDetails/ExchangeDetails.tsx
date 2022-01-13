import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Box } from '@revolut/ui-kit'

import {
  checkRequired,
  getCurrentIntlLocale,
  formatMoney,
  convertCurrencyToMonetaryUnits,
} from '@revolut/rwa-core-utils'
import { MoneyLabel } from '@revolut/rwa-feature-transactions'

type Props = {
  amount: number
  currencyTo: string
  currencyFrom: string
  rate?: number
}

const showExchangeRate = (currencyFrom: string, currencyTo: string, rate: number) => {
  const amountFrom = checkRequired(
    convertCurrencyToMonetaryUnits(currencyFrom, 1),
    '"amountFrom" can not be empty',
  )
  const rateAmount = checkRequired(
    convertCurrencyToMonetaryUnits(currencyTo, rate),
    '"rateAmount" can not be empty',
  )

  const locale = getCurrentIntlLocale()

  return `${formatMoney(amountFrom, currencyFrom, locale)} = ${formatMoney(
    rateAmount,
    currencyTo,
    locale,
  )}`
}

export const ExchangeDetails: FC<Props> = ({
  amount,
  currencyTo,
  rate,
  currencyFrom,
}) => {
  const { t } = useTranslation('pages.TransactionDetails')
  return (
    <>
      <Flex justifyContent="space-between" mt="px16">
        <Box color="transactionDetailPropName">
          {amount > 0 ? t('properties.received') : t('properties.exchanged')}
        </Box>
        <Box>
          <MoneyLabel
            amount={amount}
            currency={currencyTo}
            isGrey={false}
            isStrikethru={false}
            withSign={false}
          />
        </Box>
      </Flex>

      {rate && (
        <Flex justifyContent="space-between" mt="px16">
          <Box color="transactionDetailPropName">{t('properties.exchangeRate')}</Box>
          <Box>{showExchangeRate(currencyFrom, currencyTo, rate)}</Box>
        </Flex>
      )}
    </>
  )
}
