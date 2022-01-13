import { useCallback } from 'react'

import {
  TopupAmount,
  TopupByExternalCardResponseCheckoutComDataDto,
  TopupByExternalCardResponseDto,
  TopupByExternalCardResponseMallDataDto,
  TopupByExternalCardResponseWorldpayDataDto,
  TopupCardEntryMode,
  TopupCardOrigin,
} from '@revolut/rwa-core-types'
import { checkRequired, parseExpiryDate } from '@revolut/rwa-core-utils'

import { getBin } from '../../../utils'
import { FormValues } from '../form'
import { UseHandleFormSubmitArgs } from '../types'
import { useTopupByNewExternalCard as useTopupByNewExternalCardApi } from './api'
import { useHandleCheckoutComOrigin } from './useHandleCheckoutComOrigin'
import { useHandleMallOrigin } from './useHandleMallOrigin'
import { useHandleWorldpayOrigin } from './useHandleWorldpayOrigin'

export const useTopupByNewExternalCard = ({
  onSuccess,
  onError,
}: UseHandleFormSubmitArgs) => {
  const topupByNewExternalCardApi = useTopupByNewExternalCardApi()
  const handleCheckoutComOrigin = useHandleCheckoutComOrigin({ onSuccess, onError })
  const handleWorldpayOrigin = useHandleWorldpayOrigin({ onSuccess, onError })
  const handleMallOrigin = useHandleMallOrigin({ onSuccess, onError })

  return useCallback(
    async (formValues: FormValues, amount?: TopupAmount) => {
      const runHandleNewExternalCardStep = async (
        topupData: TopupByExternalCardResponseDto,
      ) => {
        const expiryDate = parseExpiryDate(
          formValues.cardExpiryDate,
          topupData.expiryYearFormat,
        )

        switch (topupData.data.origin) {
          case TopupCardOrigin.Checkout:
            await handleCheckoutComOrigin(
              topupData.paymentId,
              topupData.data as TopupByExternalCardResponseCheckoutComDataDto,
              expiryDate,
              formValues,
            )
            return
          case TopupCardOrigin.Worldpay:
            await handleWorldpayOrigin(
              topupData.paymentId,
              topupData.data as TopupByExternalCardResponseWorldpayDataDto,
              expiryDate,
              formValues,
            )
            return
          case TopupCardOrigin.Mall:
            await handleMallOrigin(
              topupData.paymentId,
              topupData.data as TopupByExternalCardResponseMallDataDto,
              formValues,
            )
            return
          default:
            throw new Error(`Unknown top up origin: ${topupData.data.origin}`)
        }
      }

      const runTopupByNewExternalCardStep = async () => {
        const bin = checkRequired(getBin(formValues.cardNumber), '"bin" can not be empty')
        const topUpAmount = checkRequired(amount, '"amount" can not be empty')

        await topupByNewExternalCardApi(
          {
            amount: topUpAmount,
            entryMode: TopupCardEntryMode.Manual,
            externalCardIssuerId: bin,
            postcode: formValues.postCode,
          },
          {
            onSuccess: ({ data: topupData }) => runHandleNewExternalCardStep(topupData),
            onError,
          },
        )
      }

      await runTopupByNewExternalCardStep()
    },
    [
      handleCheckoutComOrigin,
      handleMallOrigin,
      handleWorldpayOrigin,
      topupByNewExternalCardApi,
      onError,
    ],
  )
}
