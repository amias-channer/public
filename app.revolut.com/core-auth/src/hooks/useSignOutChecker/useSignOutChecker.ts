import { useEffect, useRef } from 'react'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { browser, HttpCode, Url } from '@revolut/rwa-core-utils'

import { Idle } from '../../utils/idle'
import { SignOutCause, signOutWithRedirect } from '../../utils/signOutWithRedirect'
import { useGetUserRequestStatusCode } from './useGetUserRequestStatusCode'

const INACTIVITY_PERIOD_SECONDS = getConfigValue<number>(
  ConfigKey.InactivityPeriodSeconds,
)
const INACTIVITY_PERIODS_LIMIT =
  (getConfigValue<number>(ConfigKey.LogoutAfterInactivityMinutes) * 60) /
  INACTIVITY_PERIOD_SECONDS

export const useSignOutChecker = (enabled: boolean) => {
  const { statusCode } = useGetUserRequestStatusCode(enabled)

  const signOutIsInProgress = useRef(false)
  const shouldCheckUserInactivity = useRef(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (statusCode === HttpCode.Unauthorized && !signOutIsInProgress.current) {
      browser.navigateTo(Url.Start)

      return
    }

    shouldCheckUserInactivity.current = true
  }, [enabled, statusCode])

  useEffect(() => {
    let inactivityPeriodsCount = 0

    // eslint-disable-next-line no-new
    new Idle({
      activityReportInSec: INACTIVITY_PERIOD_SECONDS,

      onReportUserIsActive() {
        if (!shouldCheckUserInactivity.current) {
          return
        }

        inactivityPeriodsCount = 0
      },

      onReportUserIsIdle() {
        if (!shouldCheckUserInactivity.current || signOutIsInProgress.current) {
          return
        }

        inactivityPeriodsCount += 1

        if (inactivityPeriodsCount >= INACTIVITY_PERIODS_LIMIT) {
          signOutIsInProgress.current = true

          signOutWithRedirect(SignOutCause.Inactivity)
        }
      },
    })
  }, [])
}
