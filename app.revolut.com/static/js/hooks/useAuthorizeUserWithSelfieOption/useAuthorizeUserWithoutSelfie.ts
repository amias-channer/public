import { AxiosError } from 'axios'
import { useHistory } from 'react-router-dom'
import { useCallback } from 'react'

import { GeneralErrorDto } from '@revolut/rwa-core-types'
import {
  ApiErrorCode,
  getApiErrorCode,
  Url,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'
import { redirectAfterSignIn } from '@revolut/rwa-core-auth'

import { useAuthorizeUserWithSelfieOption } from './useAuthorizeUserWithSelfieOption'

export const useAuthorizeUserWithoutSelfie = () => {
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()
  const authorizeUserWithSelfieOption = useAuthorizeUserWithSelfieOption()

  return useCallback(
    ({ passcode, securityCode }: { passcode?: string; securityCode?: string } = {}) => {
      return authorizeUserWithSelfieOption({
        isSelfieUsed: false,
        passcode,
        securityCode,

        onSuccess: () => {
          history.push(redirectAfterSignIn.restoreUrl())
        },
        onError: (error?: AxiosError<GeneralErrorDto>) => {
          const apiErrorCode = error ? getApiErrorCode(error) : undefined

          if (apiErrorCode === ApiErrorCode.ActionRequiresKyc) {
            history.push(Url.VerifyYourIdentity)
            return
          }

          navigateToErrorPage(error ?? 'Unknown authorize user with selfie error')
        },
      })
    },
    [history, navigateToErrorPage, authorizeUserWithSelfieOption],
  )
}
