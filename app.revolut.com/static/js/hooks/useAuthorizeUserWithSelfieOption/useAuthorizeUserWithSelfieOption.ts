import { AxiosError } from 'axios'
import { useCallback } from 'react'

import { GeneralErrorDto } from '@revolut/rwa-core-types'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { useAuthContext, useAuthorizeUser } from '@revolut/rwa-core-auth'
import {
  AxiosSecurity,
  checkRequired,
  formatPhoneNumber,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { useSignInConfirm } from '../api'

const shouldSkipConfirm = (hasAuth: boolean, isStepUp: boolean, isSelfieUsed: boolean) =>
  hasAuth && (!isStepUp || (isStepUp && !isSelfieUsed))

type SetSelfieUsageArgs = {
  isSelfieUsed: boolean
  passcode?: string
  securityCode?: string
  onSuccess: VoidFunction
  onError?: (e?: AxiosError<GeneralErrorDto>) => void
}

export const useAuthorizeUserWithSelfieOption = () => {
  const {
    beforeStepUpUrl,
    phoneNumber,
    passcode: ctxPasscode,
    securityCode: ctxSecurityCode,
    user,
    setSignInFlowChannel,
  } = useAuthContext()
  const { signInConfirm } = useSignInConfirm()
  const authorizeUser = useAuthorizeUser()
  const navigateToErrorPage = useNavigateToErrorPage()

  const hasAuth = Boolean(user)

  const handleAuthorizeUserWithSelfieOptionError = useCallback(
    (error) => navigateToErrorPage(error),
    [navigateToErrorPage],
  )

  return useCallback(
    async ({
      isSelfieUsed,
      passcode,
      securityCode,
      onSuccess,
      onError = handleAuthorizeUserWithSelfieOptionError,
    }: SetSelfieUsageArgs) => {
      setSignInFlowChannel(undefined)

      if (shouldSkipConfirm(hasAuth, Boolean(beforeStepUpUrl), isSelfieUsed)) {
        onSuccess()

        return
      }

      const plainPhoneNumber = formatPhoneNumber(phoneNumber)

      await signInConfirm(
        {
          phone: plainPhoneNumber,
          password: passcode ?? ctxPasscode,
          code: securityCode ?? ctxSecurityCode,
          limitedAccess: !isSelfieUsed,
        },
        {
          onSuccess: async ({ data }) => {
            if (isSelfieUsed) {
              if (!getConfigValue<boolean>(ConfigKey.CookieAuth)) {
                AxiosSecurity.saveUsernameAndPasswordToStorage(
                  checkRequired(data?.user?.id, 'user id can not be empty'),
                  checkRequired(
                    data.thirdFactorAuthAccessToken,
                    'thirdFactorAuthAccessToken can not be empty',
                  ),
                )
                AxiosSecurity.updateApiAuthHeaderFromStorage()
              }
            } else {
              await authorizeUser(
                {
                  user: checkRequired(data.user, '"user" can not be empty'),
                  accessToken: checkRequired(
                    data.accessToken,
                    '"accessToken" can not be empty',
                  ),
                  tokenExpiryDate: checkRequired(
                    data.tokenExpiryDate,
                    '"tokenExpiryDate" can not be empty',
                  ),
                },
                {
                  tokenIsRestricted: true,
                },
              )
            }

            onSuccess()
          },
          onError,
        },
      )
    },
    [
      beforeStepUpUrl,
      phoneNumber,
      ctxPasscode,
      ctxSecurityCode,
      hasAuth,
      authorizeUser,
      signInConfirm,
      setSignInFlowChannel,
      handleAuthorizeUserWithSelfieOptionError,
    ],
  )
}
