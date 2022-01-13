import { useQuery, useMutation } from 'react-query'
import * as Sentry from '@sentry/react'

import { TopupAmount } from '@revolut/rwa-core-types'
import {
  buildSentryContext,
  checkRequired,
  QueryKey,
  SentryTag,
} from '@revolut/rwa-core-utils'

import { getGooglePayGatewayConfig, topupByGooglePay } from '../../../../api'

export const useGooglePayGatewayConfig = (
  amount: TopupAmount | undefined,
  onError: VoidFunction,
) => {
  const { data: axiosData } = useQuery(
    [QueryKey.GooglePayGatewayConfig, amount?.currency, amount?.amount],
    () => getGooglePayGatewayConfig(checkRequired(amount, '"amount" can not be empty')),
    {
      enabled: Boolean(amount),
      staleTime: Infinity,
      cacheTime: Infinity,

      onError: (e) => {
        Sentry.captureException(e, {
          tags: { [SentryTag.Context]: buildSentryContext(['top up', 'google pay']) },
        })

        onError()
      },
    },
  )

  return { data: axiosData?.data }
}

export const useTopupByGooglePay = () => {
  const { mutate } = useMutation(topupByGooglePay)

  return mutate
}
