import { useEffect, VFC } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'
import {
  Group,
  Box,
  chain,
  Subheader,
  SubheaderSkeleton,
  ItemSkeleton,
} from '@revolut/ui-kit'

import { useCryptoRecurringPayments, useQueryWallet } from '@revolut/rwa-core-api'
import { StandingOrderState, PocketType } from '@revolut/rwa-core-types'
import {
  browser,
  checkRequired,
  CryptoDetailsSourceOption,
  getCryptoRecurringOrderDetailsUrl,
} from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../../constants'

import { RecurringCryptoOrderItem } from './RecurringCryptoOrderItem'
import { NoOrdersItem } from './NoOrdersItem'

type UrlParams = {
  cryptoCode: string
}

type UrlQuery = {
  source: CryptoDetailsSourceOption
}

export const CryptoRecurringOrders: VFC = () => {
  const { cryptoCode } = useParams<UrlParams>()
  const { source } = browser.getQueryParams<UrlQuery>()
  const { t } = useTranslation(I18N_NAMESPACE)

  const history = useHistory()

  const allRecurringPayments = useCryptoRecurringPayments()

  const { data: userWalletData, status: walletFetchStatus } = useQueryWallet()

  const isLoaded = !allRecurringPayments.isLoading && walletFetchStatus === 'success'

  useEffect(() => {
    if (isLoaded) {
      trackEvent(CryptoTrackingEvent.recurringTabOpened)
    }
  }, [isLoaded])

  if (allRecurringPayments.isLoading || walletFetchStatus !== 'success') {
    return (
      <Box mb="s-16">
        <SubheaderSkeleton />
        <Group>
          <ItemSkeleton />
          <ItemSkeleton />
        </Group>
      </Box>
    )
  }

  const userWallet = checkRequired(userWalletData, 'userWallet has to be defined')

  const pocketReceivers = userWallet.pockets
    .filter(
      (pocket) => pocket.currency === cryptoCode && pocket.type === PocketType.Current,
    )
    .map((pocket) => pocket.id)

  const activeRecurringPayments = isEmpty(pocketReceivers)
    ? []
    : allRecurringPayments.items.filter(
        (payment) =>
          pocketReceivers.includes(payment.receiver) &&
          payment.state === StandingOrderState.Active,
      )

  const inactiveRecurringPayments = isEmpty(pocketReceivers)
    ? []
    : allRecurringPayments.items.filter(
        (payment) =>
          pocketReceivers.includes(payment.receiver) &&
          payment.state === StandingOrderState.Inactive,
      )

  const onItemClick = (recurringPaymentId: string) => () => {
    history.push(
      getCryptoRecurringOrderDetailsUrl(cryptoCode, recurringPaymentId, source),
    )
  }

  return (
    <>
      <Box mb="s-16">
        <Subheader>
          <Subheader.Title>
            {chain([t('RecurringOrders.activeState'), activeRecurringPayments.length])}
          </Subheader.Title>
        </Subheader>
        <Group>
          {isEmpty(activeRecurringPayments) ? (
            <NoOrdersItem />
          ) : (
            activeRecurringPayments.map((payment) => (
              <RecurringCryptoOrderItem
                key={payment.id}
                cryptoCode={cryptoCode}
                recurringPaymentItem={payment}
                onClick={onItemClick(payment.id)}
              />
            ))
          )}
        </Group>
      </Box>
      {!isEmpty(inactiveRecurringPayments) && (
        <Box mb="s-16">
          <Subheader>
            <Subheader.Title>
              {chain([
                t('RecurringOrders.inactiveState'),
                inactiveRecurringPayments.length,
              ])}
            </Subheader.Title>
          </Subheader>
          <Group>
            {inactiveRecurringPayments.map((payment) => (
              <RecurringCryptoOrderItem
                key={payment.id}
                cryptoCode={cryptoCode}
                recurringPaymentItem={payment}
                onClick={onItemClick(payment.id)}
              />
            ))}
          </Group>
        </Box>
      )}
    </>
  )
}
