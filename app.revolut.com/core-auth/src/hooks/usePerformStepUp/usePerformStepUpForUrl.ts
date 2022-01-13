import { parsePhoneNumber } from 'libphonenumber-js/min'
import { useCallback } from 'react'

import { isRestrictedAccessToken, checkRequired } from '@revolut/rwa-core-utils'

import { useAuthContext } from '../../providers'
import { usePerformStepUp } from './usePerformStepUp'

export const usePerformStepUpForUrl = (url: string) => {
  const { user } = useAuthContext()

  const performStepUp = usePerformStepUp()

  const performStepUpForUrl = useCallback(() => {
    if (!isRestrictedAccessToken()) {
      return false
    }

    const parsedPhoneNumber = parsePhoneNumber(
      checkRequired(user, '"user" can not be empty').phone,
    )

    performStepUp({
      beforeStepUpUrl: url,
      afterStepUpUrl: url,
      userPhoneNumber: {
        code: checkRequired(parsedPhoneNumber.country, '"code" can not be empty'),
        number: parsedPhoneNumber.nationalNumber.toString(),
      },
    })

    return true
  }, [url, user, performStepUp])

  return {
    performStepUpForUrl,
    isStepUpInitializing: !user,
  }
}
