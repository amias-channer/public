import { AxiosError } from 'axios'
import { useQuery, useMutation } from 'react-query'

import { GeneralErrorDto, SignInTokenRequestDto } from '@revolut/rwa-core-types'
import { HttpCode, QueryKey } from '@revolut/rwa-core-utils'

import {
  confirmPushNotificationRequest,
  rejectPushNotificationRequest,
  signInInitialize,
  signInToken,
} from 'api'

const TOKEN_STATUS_RETRY_DELAY = 2000

export const useSignIn = () => {
  const { mutate, status } = useMutation(signInInitialize)

  return { signIn: mutate, status }
}

export const useQueryTokenStatus = (
  data: SignInTokenRequestDto,
  isPushNotificationSent: boolean,
  onError: (e: AxiosError<GeneralErrorDto>) => void,
) => {
  const { data: axiosData, status } = useQuery(
    [QueryKey.SignInTokenStatus, data],
    () => signInToken(data),
    {
      enabled: isPushNotificationSent,
      staleTime: 0,
      cacheTime: 0,

      retry: (_failureCount, error: AxiosError) =>
        error.response?.status === HttpCode.UnprocessableEntity,

      retryDelay: () => TOKEN_STATUS_RETRY_DELAY,

      onError,
    },
  )

  return { data: axiosData?.data, status }
}

export const useConfirmPushNotificationRequest = () => {
  const { mutate, isLoading } = useMutation(confirmPushNotificationRequest)

  return { confirmPushNotificationRequest: mutate, isLoading }
}

export const useRejectPushNotificationRequest = () => {
  const { mutate, isLoading } = useMutation(rejectPushNotificationRequest)

  return { rejectPushNotificationRequest: mutate, isLoading }
}
