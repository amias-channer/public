import { parsePhoneNumber } from 'libphonenumber-js/min'
import { useCallback } from 'react'

import { checkRequired, Url } from '@revolut/rwa-core-utils'

import { usePerformStepUp } from '../../hooks'

export const useTryToPerformStepUp = (
  userPhone: string | undefined,
  afterStepUpUrl: string | undefined,
) => {
  const performStepUp = usePerformStepUp()

  return useCallback(() => {
    if (!userPhone) {
      return
    }

    const parsedPhoneNumber = parsePhoneNumber(userPhone)

    performStepUp({
      beforeStepUpUrl: Url.Home,
      afterStepUpUrl: checkRequired(afterStepUpUrl, '"afterStepUpUrl" can not be empty'),
      userPhoneNumber: {
        code: checkRequired(parsedPhoneNumber.country, '"code" can not be empty'),
        number: parsedPhoneNumber.nationalNumber.toString(),
      },
    })
  }, [userPhone, afterStepUpUrl, performStepUp])
}
