import { useCallback } from 'react'
import { useQueryClient, useMutation } from 'react-query'

import { TopupAmount } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import {
  getApplePayGatewayConfig,
  topupByApplePay,
  validateApplePayMerchant,
} from '../../../../api'

export const useApplePayGatewayConfig = () => {
  const queryClient = useQueryClient()

  return useCallback(
    async (amount: TopupAmount) => {
      const { data } = await queryClient.fetchQuery(
        [QueryKey.ApplePayGatewayConfig, amount],
        () => getApplePayGatewayConfig(amount),
      )

      return data
    },
    [queryClient],
  )
}

export const useTopupByApplePay = () => {
  const { mutate } = useMutation(topupByApplePay)

  return mutate
}

export const useValidateApplePayMerchant = () => {
  const { mutate } = useMutation(validateApplePayMerchant)

  return mutate
}
