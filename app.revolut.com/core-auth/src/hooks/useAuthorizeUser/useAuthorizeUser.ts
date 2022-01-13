import { useCallback } from 'react'
import { QueryClient, useQueryClient } from 'react-query'

import {
  setTrackedUserId,
  SignInTrackingEvent,
  trackEvent,
} from '@revolut/rwa-core-analytics'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { SignInTokenResponseDto } from '@revolut/rwa-core-types'
import {
  AxiosSecurity,
  QueryKey,
  secureStorage,
  SecureStorageKey,
} from '@revolut/rwa-core-utils'

import { useAuthContext } from '../../providers'

const invalidateSelectedQueries = async (queryClient: QueryClient) => {
  const queryKeysToBeInvalidated = [QueryKey.Cards, QueryKey.UserCard]

  await Promise.all(
    queryKeysToBeInvalidated.map((queryKey) => queryClient.invalidateQueries(queryKey)),
  )
}

export const useAuthorizeUser = () => {
  const queryClient = useQueryClient()
  const {
    signInFlowChannel,
    setSignInFlowChannel,
    setBeforeStepUpUrl,
    setAfterStepUpUrl,
    setSecurityCode,
    setPasscode,
    setAuthorized,
    refetchUser,
  } = useAuthContext()

  return useCallback(
    async (
      token: SignInTokenResponseDto,
      {
        tokenIsRestricted,
        doNotTrackEvents = false,
      }: { tokenIsRestricted: boolean; doNotTrackEvents?: boolean },
    ) => {
      if (!getConfigValue<boolean>(ConfigKey.CookieAuth)) {
        AxiosSecurity.saveUsernameAndPasswordToStorage(
          token.user.id,
          token.accessToken,
          token.tokenExpiryDate,
        )
        AxiosSecurity.updateApiAuthHeaderFromStorage()
      }

      setTrackedUserId(token.user.id)

      if (!doNotTrackEvents) {
        trackEvent(SignInTrackingEvent.signInSucceeded, { channel: signInFlowChannel })
      }

      setSignInFlowChannel(undefined)
      setBeforeStepUpUrl(undefined)
      setAfterStepUpUrl(undefined)
      setSecurityCode('')
      setPasscode('')
      setAuthorized(true)

      secureStorage.setItem(SecureStorageKey.AuthTokenIsRestricted, tokenIsRestricted)

      await refetchUser()
      await invalidateSelectedQueries(queryClient)
    },
    [
      signInFlowChannel,
      setSignInFlowChannel,
      setBeforeStepUpUrl,
      setAfterStepUpUrl,
      setSecurityCode,
      setPasscode,
      setAuthorized,
      refetchUser,
      queryClient,
    ],
  )
}
