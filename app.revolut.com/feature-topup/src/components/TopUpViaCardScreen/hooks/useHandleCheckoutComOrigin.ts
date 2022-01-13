import { useCallback } from 'react'

import {
  CheckoutComTokenResponseDto,
  TopupByExternalCardResponseCheckoutComDataDto,
} from '@revolut/rwa-core-types'
import { ExpiryDate } from '@revolut/rwa-core-utils'

import { FormValues } from '../form'
import { UseHandleFormSubmitArgs } from '../types'
import { useGetCheckoutComToken, useProcessCheckoutComToken } from './api'

const CHECKOUT_COM_CARD_TOKEN_TYPE = 'card'

export const useHandleCheckoutComOrigin = ({
  onSuccess,
  onError,
}: UseHandleFormSubmitArgs) => {
  const getCheckoutComToken = useGetCheckoutComToken()
  const processCheckoutComToken = useProcessCheckoutComToken()

  return useCallback(
    async (
      paymentId: string,
      checkoutComData: TopupByExternalCardResponseCheckoutComDataDto,
      expiryDate: ExpiryDate,
      formValues: FormValues,
    ) => {
      const runProcessCheckoutComTokenStep = async (
        tokenData: CheckoutComTokenResponseDto,
      ) => {
        await processCheckoutComToken(
          {
            cardData: tokenData,
            data: checkoutComData,
            paymentId,
          },
          {
            onSuccess: ({ data: processData }) =>
              onSuccess({ paymentId, paymentUrl: processData.paymentUrl }),
            onError,
          },
        )
      }

      const runGetCheckoutComTokenStep = async () => {
        await getCheckoutComToken(
          {
            publicKey: checkoutComData.publicKey,
            data: {
              number: formValues.cardNumber,
              expiry_month: expiryDate.month,
              expiry_year: expiryDate.year,
              cvv: formValues.cardCvv,
              type: CHECKOUT_COM_CARD_TOKEN_TYPE,
            },
          },
          {
            onSuccess: ({ data: tokenData }) => runProcessCheckoutComTokenStep(tokenData),
            onError,
          },
        )
      }

      await runGetCheckoutComTokenStep()
    },
    [getCheckoutComToken, processCheckoutComToken, onSuccess, onError],
  )
}
