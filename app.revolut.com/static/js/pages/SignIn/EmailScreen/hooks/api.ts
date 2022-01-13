import { useMutation, useQuery, useQueryClient } from 'react-query'

import { verificationCode } from '@revolut/rwa-core-api'
import { isStagingOrProductionEnv } from '@revolut/rwa-core-config'
import { PhoneNumberValue } from '@revolut/rwa-core-types'
import { formatPhoneNumber, QueryKey } from '@revolut/rwa-core-utils'

import { signInInitialize } from 'api'

export const useSignIn = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation(signInInitialize, {
    onSuccess: async () => {
      if (!isStagingOrProductionEnv()) {
        await queryClient.invalidateQueries(QueryKey.VerificationCode)
      }
    },
  })

  return { signIn: mutate, isLoading }
}

export const useQueryVerificationCode = (phoneNumber: PhoneNumberValue) => {
  const phone = formatPhoneNumber(phoneNumber)
  const { data: axiosData } = useQuery(
    [QueryKey.VerificationCode, phone],
    () => verificationCode(phone),
    {
      enabled: !isStagingOrProductionEnv(),
      staleTime: 0,
    },
  )

  return axiosData?.data.code
}
