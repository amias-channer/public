import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { AxiosSecurity, Url, browser, I18nNamespace } from '@revolut/rwa-core-utils'

import { useCountdown, useShowCookiesBannerOnMount } from 'hooks'

import { I18N_NAMESPACE } from '../constants'
import { RequestScopedTokenScreenProps } from '../types'
import { ScreenDescription } from './ScreenDescription'

const USER_AUTH_FAILED_TIMER_SECONDS = 120

export const IdentityVerificationFailedScreen: FC<RequestScopedTokenScreenProps> = () => {
  const { t } = useTranslation([I18N_NAMESPACE, I18nNamespace.Common])
  const { timeLeft, isFinished } = useCountdown(USER_AUTH_FAILED_TIMER_SECONDS)
  useShowCookiesBannerOnMount()

  useEffect(() => {
    AxiosSecurity.signOut()
  }, [])

  const handleSubmitButtonClick = () => {
    browser.navigateTo(Url.Start)
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Error}
      title={t('IdentityVerificationFailedScreen.title')}
      authLayoutProps={{
        description: (
          <ScreenDescription timeLeft={timeLeft} isTimerFinished={isFinished} />
        ),
        submitButtonText: t(`${I18nNamespace.Common}:done`),
        submitButtonEnabled: isFinished,
        handleSubmitButtonClick,
      }}
    />
  )
}
