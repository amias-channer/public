import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { PhoneNumberValue } from '@revolut/rwa-core-types'
import { isRestrictedAccessToken, Url } from '@revolut/rwa-core-utils'

import { useAuthContext } from '../../providers'

export const usePerformStepUp = () => {
  const history = useHistory()
  const {
    phoneNumber: authPhoneNumber,
    setPhoneNumber,
    setBeforeStepUpUrl,
    setAfterStepUpUrl,
  } = useAuthContext()

  return useCallback(
    ({
      beforeStepUpUrl,
      afterStepUpUrl,
      userPhoneNumber,
    }: {
      beforeStepUpUrl: string
      afterStepUpUrl: string
      userPhoneNumber?: PhoneNumberValue
    }) => {
      if (!isRestrictedAccessToken()) {
        history.push(afterStepUpUrl)

        return
      }

      const phoneNumber: PhoneNumberValue = {
        code: userPhoneNumber?.code ?? authPhoneNumber.code,
        number: userPhoneNumber?.number ?? authPhoneNumber.number,
      }

      setPhoneNumber(phoneNumber)
      setBeforeStepUpUrl(beforeStepUpUrl)
      setAfterStepUpUrl(afterStepUpUrl)

      history.push(Url.SignIn)
    },
    [
      history,
      authPhoneNumber.code,
      authPhoneNumber.number,
      setPhoneNumber,
      setBeforeStepUpUrl,
      setAfterStepUpUrl,
    ],
  )
}
