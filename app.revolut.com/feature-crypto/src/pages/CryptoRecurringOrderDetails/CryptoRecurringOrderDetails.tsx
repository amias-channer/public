import { VFC } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  Layout,
  Header,
  HeaderSkeleton,
  Group,
  DetailsCell,
  DetailsCellSkeleton,
  Box,
  Avatar,
  chain,
} from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

import { StandingOrderState } from '@revolut/rwa-core-types'
import { useLocale } from '@revolut/rwa-core-i18n'
import { useCryptoRecurringPayments } from '@revolut/rwa-core-api'
import {
  formatMoney,
  getFormattedDate,
  CryptoDetailsSourceOption,
  browser,
  getCryptoDetailsUrl,
  getRecurringPeriodText,
} from '@revolut/rwa-core-utils'
import { getConfigValue, ConfigKey, CurrenciesType } from '@revolut/rwa-core-config'

import { CryptoAvatar } from '../../components'

type UrlParams = {
  cryptoCode: string
  recurringOrderId: string
}

type UrlQuery = {
  source: CryptoDetailsSourceOption
}

export const CryptoRecurringOrderDetails: VFC = () => {
  const { locale } = useLocale()
  const { t } = useTranslation(['pages.CryptoRecurringOrderDetails'])

  const { cryptoCode, recurringOrderId } = useParams<UrlParams>()
  const { source } = browser.getQueryParams<UrlQuery>()

  const allRecurringPayments = useCryptoRecurringPayments()
  const history = useHistory()

  if (allRecurringPayments.isLoading) {
    return (
      <Layout>
        <Layout.Main>
          <HeaderSkeleton variant="item" />
          <Box mb="s-32">
            <Group>
              <DetailsCellSkeleton />
              <DetailsCellSkeleton />
              <DetailsCellSkeleton />
            </Group>
          </Box>
        </Layout.Main>
      </Layout>
    )
  }

  const recurringPayment = allRecurringPayments.items.find(
    (payment) => payment.id === recurringOrderId,
  )

  if (!recurringPayment) {
    throw new Error(`No such recurring payment with id = ${recurringOrderId}`)
  }

  const cryptoCurrenciesInfo = getConfigValue<CurrenciesType>(ConfigKey.CryptoCurrencies)
  const currencyInfo = cryptoCurrenciesInfo[cryptoCode]

  const isActive = recurringPayment.state === StandingOrderState.Active

  const onBackButtonClick = () => {
    history.push(getCryptoDetailsUrl(cryptoCode, { tab: 'recurring', source }))
  }

  return (
    <Layout>
      <Layout.Main>
        <Header variant="item">
          <Header.BackButton aria-label="Back" onClick={onBackButtonClick} />
          <Header.Title>
            {formatMoney(recurringPayment.amount, recurringPayment.currency, locale)}
          </Header.Title>
          <Header.Avatar>
            <CryptoAvatar cryptoCode={cryptoCode}>
              <Avatar.Badge useIcon={Icons.PaymentsRecurring} />
            </CryptoAvatar>
          </Header.Avatar>
          <Header.Subtitle>
            {chain([
              currencyInfo.currency,
              isActive ? t('orderState.active') : t('orderState.inactive'),
            ])}
          </Header.Subtitle>
          <Header.Description>{t('pageDescription.text')}</Header.Description>
        </Header>
        <Group>
          <DetailsCell>
            <DetailsCell.Title>{t('nextPurchase.text')}</DetailsCell.Title>
            <DetailsCell.Content>
              {getFormattedDate(new Date(recurringPayment.nextDate))}
            </DetailsCell.Content>
          </DetailsCell>
          <DetailsCell>
            <DetailsCell.Title>{t('startDate.text')}</DetailsCell.Title>
            <DetailsCell.Content>
              {getFormattedDate(new Date(recurringPayment.startDate))}
            </DetailsCell.Content>
          </DetailsCell>
          <DetailsCell>
            <DetailsCell.Title>{t('totalPaid.text')}</DetailsCell.Title>
            <DetailsCell.Content>
              {formatMoney(recurringPayment.amount, recurringPayment.currency, locale)}
            </DetailsCell.Content>
          </DetailsCell>
        </Group>
        <Box mt="s-16">
          <DetailsCell>
            <DetailsCell.Title>{t('repeatPurchase.text')}</DetailsCell.Title>
            <DetailsCell.Content>
              {getRecurringPeriodText(recurringPayment.period)}
            </DetailsCell.Content>
          </DetailsCell>
        </Box>
      </Layout.Main>
    </Layout>
  )
}
