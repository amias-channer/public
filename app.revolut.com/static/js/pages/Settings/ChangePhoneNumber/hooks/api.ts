import { AxiosError, AxiosResponse } from 'axios'
import { useCallback, useEffect } from 'react'
import { useQueryClient, useMutation, QueryClient } from 'react-query'

import { useHandleVerificationProcess, useAuthorizeUser } from '@revolut/rwa-core-auth'
import {
  GeneralErrorDto,
  UserPhoneChangeConfirmResponseDto,
  UserPhoneChangeErrorDto,
} from '@revolut/rwa-core-types'
import { QueryKey, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { confirmPhoneChange, requestPhoneChange } from 'api'
import { ConfirmPhoneChangeArgs, RequestPhoneChangeArgs } from 'api/retail/user'

export const useInitiatePhoneChange = (storedPhone: string, onSuccess: VoidFunction) => {
  const navigateToErrorPage = useNavigateToErrorPage()

  const { mutate, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<GeneralErrorDto>,
    RequestPhoneChangeArgs
  >(requestPhoneChange, { onSuccess })

  const {
    config,
    verificationStepsProps,
    onError: handleVerificationError,
  } = useHandleVerificationProcess((error) => navigateToErrorPage(error))

  const initiatePhoneChange = useCallback(
    (phone: string) => {
      mutate({ phone, config }, { onError: handleVerificationError })
    },
    [config, handleVerificationError, mutate],
  )

  useEffect(() => {
    if (storedPhone && config) {
      initiatePhoneChange(storedPhone)
    }
  }, [config, initiatePhoneChange, storedPhone])

  return {
    isLoading: isLoading || Boolean(verificationStepsProps.verificationMethod),
    verificationStepsProps,
    initiatePhoneChange,
  }
}

const replaceUserDataQueryCache = (
  queryClient: QueryClient,
  data: UserPhoneChangeConfirmResponseDto,
) => {
  queryClient.setQueryData(QueryKey.User, { data: { user: data.user } })
}

export const useSubmitNewPhoneOtp = () => {
  const authorizeUser = useAuthorizeUser()
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation<
    AxiosResponse<UserPhoneChangeConfirmResponseDto>,
    AxiosError<UserPhoneChangeErrorDto>,
    ConfirmPhoneChangeArgs
  >(confirmPhoneChange, {
    onSuccess: async (response) => {
      await authorizeUser(response.data, {
        tokenIsRestricted: false,
        doNotTrackEvents: true,
      })

      replaceUserDataQueryCache(queryClient, response.data)
    },
  })

  return {
    submitNewPhoneOtp: mutate,
    isLoading,
  }
}
