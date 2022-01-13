import { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { trackEvent, SignInTrackingEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext, SignInFlowChannel } from '@revolut/rwa-core-auth'
import {
  AuthLayout,
  H2,
  Illustration,
  IllustrationAssetId,
  Spacer,
  TextBox,
} from '@revolut/rwa-core-components'
import { SignInOtpChannel } from '@revolut/rwa-core-types'
import { formatPhoneNumber } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE, SignInScreen } from '../constants'
import { SignInScreenProps } from '../types'
import { DevOtpCode } from './DevOtpCode'
import { useBroadcast, useQueryVerificationCode, useSignIn } from './hooks'
import { ScreenDescription } from './ScreenDescription'

export const EmailScreen: FC<SignInScreenProps> = ({ onScreenChange }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { phoneNumber, setSignInFlowChannel } = useAuthContext()

  const { signIn } = useSignIn()
  const code = useQueryVerificationCode(phoneNumber)

  useEffect(() => {
    trackEvent(SignInTrackingEvent.emailAuthScreenOpened)
    return () => {
      trackEvent(SignInTrackingEvent.emailAuthScreenClosed)
    }
  }, [])

  const handleBackButtonClick = useCallback(() => {
    onScreenChange(SignInScreen.AuthenticationMethod)
  }, [onScreenChange])

  useBroadcast(phoneNumber)

  useEffect(() => {
    setSignInFlowChannel(SignInFlowChannel.Email)
  }, [setSignInFlowChannel])

  useEffect(() => {
    signIn({
      phone: formatPhoneNumber(phoneNumber),
      channel: SignInOtpChannel.Email,
    })
  }, [phoneNumber, signIn])

  return (
    <AuthLayout
      illustration={<Illustration assetId={IllustrationAssetId.OtpViaEmail} />}
      centerContent
      handleBackButtonClick={handleBackButtonClick}
    >
      <H2>{t('EmailScreen.title')}</H2>
      <TextBox>
        <ScreenDescription />
        {code && <DevOtpCode code={code} />}
      </TextBox>

      <Spacer h="px16" />

      <TextBox>{t('EmailScreen.limitedAccessText')}</TextBox>
    </AuthLayout>
  )
}
