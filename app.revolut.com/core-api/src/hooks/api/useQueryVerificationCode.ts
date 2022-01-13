import { useQuery } from 'react-query'

import { isStagingOrProductionEnv } from '@revolut/rwa-core-config'
import { checkRequired, QueryKey } from '@revolut/rwa-core-utils'

import { verificationCode } from '../../api'

export const useQueryVerificationCode = (phoneNumber?: string) => {
  const { data: axiosData } = useQuery(
    [QueryKey.VerificationCode, phoneNumber],
    () => verificationCode(checkRequired(phoneNumber, '"phoneNumber" can not be empty')),
    {
      enabled: !isStagingOrProductionEnv(),
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  )

  return axiosData?.data.code
}
