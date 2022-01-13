import { useCallback } from 'react'

import { TopupByExternalCardResponseWorldpayDataDto } from '@revolut/rwa-core-types'
import { ExpiryDate, getTopUpWorldpay3dsUrl } from '@revolut/rwa-core-utils'

import { FormValues } from '../form'
import { UseHandleFormSubmitArgs } from '../types'
import { useGetWorldpayToken } from './useGetWorldpayToken'

export const useHandleWorldpayOrigin = ({
  onSuccess,
  onError,
}: UseHandleFormSubmitArgs) => {
  const getWorldpayToken = useGetWorldpayToken()

  return useCallback(
    async (
      paymentId: string,
      worldpayData: TopupByExternalCardResponseWorldpayDataDto,
      expiryDate: ExpiryDate,
      formValues: FormValues,
    ) => {
      const runProcessWorldpayAuthCallback = async (tokenData: string) => {
        onSuccess({
          paymentId,
          paymentUrl: getTopUpWorldpay3dsUrl(paymentId),
          formToIframeData: { encryptedData: tokenData },
        })
      }

      const runGetWorldpayTokenStep = async () => {
        await getWorldpayToken(
          {
            publicKey: worldpayData.publicKey,
            data: {
              number: formValues.cardNumber,
              expiryMonth: expiryDate.month,
              expiryYear: expiryDate.year,
              cvv: formValues.cardCvv,
              cardHolderName: worldpayData.cardholderName,
            },
          },
          {
            onSuccess: ({ data: tokenData }) => runProcessWorldpayAuthCallback(tokenData),
            onError,
          },
        )
      }

      await runGetWorldpayTokenStep()
    },
    [getWorldpayToken, onSuccess, onError],
  )
}
