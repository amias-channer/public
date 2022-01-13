import { useCallback } from 'react'

import {
  ConfigKey,
  getConfigValue,
  isStagingOrProductionEnv,
} from '@revolut/rwa-core-config'
import { asyncScriptLoader, checkRequired } from '@revolut/rwa-core-utils'

/**
 * @see https://developer.worldpay.com/docs/wpg/reference/testvalues#3d-secure-3ds-test-values
 */
const getCardHolderName = (name: string) => (isStagingOrProductionEnv() ? name : '3D')

type UseGetWorldpayTokenVariables = {
  publicKey: string
  data: {
    number: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    cardHolderName: string
  }
}

type UseGetWorldpayTokenOptions = {
  onSuccess: (data: { data: string }) => void
  onError: VoidFunction
}

/**
 * @see https://developer.worldpay.com/docs/wpg/clientsideencryption/javascript-integration
 */
export const useGetWorldpayToken = () => {
  return useCallback(
    async (
      { publicKey, data }: UseGetWorldpayTokenVariables,
      { onSuccess, onError }: UseGetWorldpayTokenOptions,
    ) => {
      await asyncScriptLoader(getConfigValue(ConfigKey.WorldpayWidgetUrl))

      const worldpayApi = checkRequired(window.Worldpay, '"Worldpay" can not be empty')

      worldpayApi.setPublicKey(publicKey)

      const encryptedData = worldpayApi.encrypt(
        {
          cardNumber: data.number,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvc: data.cvv,
          cardHolderName: getCardHolderName(data.cardHolderName),
        },
        (...errorCodes) => errorCodes.length && onError(),
      )

      if (encryptedData) {
        onSuccess({ data: encryptedData })
      }
    },
    [],
  )
}
