import { useCallback } from 'react'

import { TopupByExternalCardResponseMallDataDto } from '@revolut/rwa-core-types'

import { DEFAULT_MALL_SAVE_PAYMENT_METHOD } from '../../constants'
import { FormValues } from '../form'
import { UseHandleFormSubmitArgs } from '../types'
import { normalizeAddress, getMallBrowserFingerprint } from '../utils'
import { useMallPay } from './api'

export const useHandleMallOrigin = ({ onSuccess, onError }: UseHandleFormSubmitArgs) => {
  const mallPay = useMallPay()

  return useCallback(
    async (
      paymentId: string,
      mallData: TopupByExternalCardResponseMallDataDto,
      formValues: FormValues,
    ) => {
      const runMallPayStep = async () => {
        const browserFingerprint = getMallBrowserFingerprint()

        await mallPay(
          {
            orderId: mallData.order_public_id,
            transactionId: mallData.transaction_id,
            data: {
              card: {
                pan: formValues.cardNumber,
                expiry: formValues.cardExpiryDate,
                cvv: formValues.cardCvv,
              },
              browser: browserFingerprint,
              customer: {
                billing_address: normalizeAddress({
                  country: mallData.country,
                  region: mallData.region,
                  city: mallData.city,
                  postcode: mallData.postcode,
                  streetLine1: mallData.street_line1,
                  streetLine2: mallData.street_line2,
                }),
                email: mallData.email,
                name: mallData.full_name,
              },
              save_payment_method_for: DEFAULT_MALL_SAVE_PAYMENT_METHOD,
            },
          },
          {
            onSuccess: ({ data: payData }) => {
              onSuccess({
                paymentId,
                paymentUrl: payData.challenge?.acs_url,
              })
            },
            onError,
          },
        )
      }

      await runMallPayStep()
    },
    [mallPay, onSuccess, onError],
  )
}
