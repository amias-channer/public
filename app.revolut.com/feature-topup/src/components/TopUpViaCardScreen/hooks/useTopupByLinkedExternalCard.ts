import { useCallback } from 'react'

import {
  TopupAmount,
  TopupByExternalCardResponseDto,
  TopupByExternalCardResponseMallDataDto,
  TopupCardOrigin,
  UserTopupCardDto,
} from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import { DEFAULT_MALL_SAVE_PAYMENT_METHOD } from '../../constants'
import { FormValues } from '../form'
import { UseHandleFormSubmitArgs } from '../types'
import { getMallBrowserFingerprint } from '../utils'
import { useTopupByExternalCard, useMallPayByExistingMethod } from './api'

export const useTopupByLinkedExternalCard = ({
  onSuccess,
  onError,
}: UseHandleFormSubmitArgs) => {
  const topupByExternalCard = useTopupByExternalCard()
  const mallPayByExistingMethod = useMallPayByExistingMethod()

  return useCallback(
    async (
      formValues: FormValues,
      amount?: TopupAmount,
      linkedCard?: UserTopupCardDto,
    ) => {
      const topUpAmount = checkRequired(amount, '"amount" can not be empty')
      const externalCardId = checkRequired(linkedCard?.id, '"cardId" can not be empty')

      const handleMallOrigin = (topupData: TopupByExternalCardResponseDto) => {
        const browserFingerprint = getMallBrowserFingerprint()
        const mallData = topupData.data as TopupByExternalCardResponseMallDataDto

        const orderId = checkRequired(
          mallData.order_public_id,
          '"orderId" can not be empty',
        )
        const paymentMethodId = checkRequired(
          mallData.payment_method_id,
          '"paymentMethodId" can not be empty',
        )
        const cardCvv = formValues.cardCvv

        mallPayByExistingMethod(
          {
            orderId,
            transactionId: topupData.paymentId,
            data: {
              browser: browserFingerprint,
              payment_method: {
                id: paymentMethodId,
                cvv: cardCvv === '' ? undefined : cardCvv,
              },
              save_payment_method_for: DEFAULT_MALL_SAVE_PAYMENT_METHOD,
            },
          },
          {
            onSuccess: ({ data: payData }) => {
              onSuccess({
                paymentId: topupData.paymentId,
                paymentUrl: payData.challenge?.acs_url,
              })
            },

            onError,
          },
        )
      }

      const handleOtherOrigin = (topupData: TopupByExternalCardResponseDto) => {
        if (topupData.paymentUrl) {
          onSuccess({
            paymentId: topupData.paymentId,
            paymentUrl: topupData.paymentUrl,
            formToIframeData: {
              ...topupData.data,
              cvv: formValues.cardCvv,
            },
          })
        } else {
          onSuccess({
            paymentId: topupData.paymentId,
          })
        }
      }

      await topupByExternalCard(
        {
          amount: topUpAmount.amount,
          currency: topUpAmount.currency,
          externalCardId,
        },
        {
          onSuccess: ({ data: topupData }) => {
            if (topupData.data.origin === TopupCardOrigin.Mall) {
              handleMallOrigin(topupData)
            } else {
              handleOtherOrigin(topupData)
            }
          },
          onError,
        },
      )
    },
    [topupByExternalCard, mallPayByExistingMethod, onSuccess, onError],
  )
}
