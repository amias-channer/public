import { AxiosError } from 'axios'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { trackEvent, SignInTrackingEvent } from '@revolut/rwa-core-analytics'
import {
  useAuthContext,
  useAuthorizeUser,
  SignInFlowChannel,
  redirectAfterSignIn,
} from '@revolut/rwa-core-auth'
import {
  H2,
  AuthLayout,
  Spacer,
  Illustration,
  IllustrationAssetId,
} from '@revolut/rwa-core-components'
import { GeneralErrorDto, SignInOtpChannel } from '@revolut/rwa-core-types'
import { ApiErrorCode, formatPhoneNumber, HttpCode, Url } from '@revolut/rwa-core-utils'

import { CountdownCircle } from 'components'
import { useCountdown } from 'hooks'

import { I18N_NAMESPACE, SignInScreen } from '../constants'
import { SignInScreenProps } from '../types'
import { isErrorMatchesGivenCodes } from '../utils'
import { useQueryTokenStatus, useSignIn } from './hooks'
import { ScreenDescription } from './ScreenDescription'

export const TOKEN_EXPIRATION_TIME_SECONDS = 60 * 10

const getTitleKey = (isError: boolean) =>
  `PushNotificationScreen.title.${isError ? 'error' : 'default'}`

const isInvalidPasscode = (e: AxiosError<GeneralErrorDto>) =>
  isErrorMatchesGivenCodes(e, HttpCode.Unauthorized, ApiErrorCode.Unauthorised)

const shouldNotUpdateFlowChannel = (flowChannel: SignInFlowChannel | undefined) =>
  flowChannel && flowChannel === SignInFlowChannel.PushNotification

export const PushNotificationScreen: FC<SignInScreenProps> = ({ onScreenChange }) => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)
  const {
    signInFlowChannel,
    beforeStepUpUrl,
    afterStepUpUrl,
    phoneNumber,
    passcode,
    pushTokenId,
    setPushTokenId,
    setSignInFlowChannel,
  } = useAuthContext()
  const { timeLeft, isFinished, restartCountdown } = useCountdown(
    TOKEN_EXPIRATION_TIME_SECONDS,
  )
  const [retriesCount, setRetriesCount] = useState(0)

  const authorizeUser = useAuthorizeUser()
  const { signIn, status: signInStatus } = useSignIn()

  const resendPushNotification = useCallback(() => {
    restartCountdown()

    setRetriesCount((value) => value + 1)
    signIn(
      {
        phone: formatPhoneNumber(phoneNumber),
        channel: SignInOtpChannel.App,
        password: passcode,
      },
      {
        onSuccess({ data }) {
          setPushTokenId(data.tokenId)
        },
      },
    )
  }, [phoneNumber, passcode, restartCountdown, signIn, setPushTokenId, setRetriesCount])

  useEffect(() => {
    trackEvent(SignInTrackingEvent.pushAuthScreenOpened)
    return () => {
      trackEvent(SignInTrackingEvent.pushAuthScreenClosed)
    }
  }, [])

  const handleBackButtonClick = () => {
    history.push(beforeStepUpUrl ?? Url.Start)
  }

  const handleUseDifferentMethod = () => onScreenChange(SignInScreen.AuthenticationMethod)

  const isSignInSuccess = signInStatus === 'success' || retriesCount === 0
  const isSignInErrorOrTimeOut = signInStatus === 'error' || isFinished

  const handleTokenStatusError = useCallback(
    (e: AxiosError<GeneralErrorDto>) => {
      if (isInvalidPasscode(e)) {
        onScreenChange(SignInScreen.Passcode)
      }
    },
    [onScreenChange],
  )

  const plainPhoneNumber = formatPhoneNumber(phoneNumber)

  const { data: tokenData, status: tokenStatus } = useQueryTokenStatus(
    {
      phone: plainPhoneNumber,
      password: passcode,
      tokenId: pushTokenId,
    },
    isSignInSuccess && Boolean(passcode) && Boolean(pushTokenId),
    handleTokenStatusError,
  )

  useEffect(() => {
    if (tokenStatus !== 'success' || !tokenData) {
      return
    }

    authorizeUser(tokenData, {
      tokenIsRestricted: false,
    }).then(() => {
      history.push(afterStepUpUrl ?? redirectAfterSignIn.restoreUrl())
    })
  }, [tokenData, tokenStatus, afterStepUpUrl, history, authorizeUser])

  useEffect(() => {
    if (shouldNotUpdateFlowChannel(signInFlowChannel)) {
      return
    }

    setSignInFlowChannel(SignInFlowChannel.PushNotification)
  }, [signInFlowChannel, setSignInFlowChannel])

  const isSubmitButtonVisible = isSignInErrorOrTimeOut || retriesCount > 1

  return (
    <AuthLayout
      centerContent
      illustration={<Illustration assetId={IllustrationAssetId.PushNotificationCode} />}
      submitButtonText={t('common:try_again')}
      submitButtonEnabled={isSignInErrorOrTimeOut}
      handleBackButtonClick={handleBackButtonClick}
      handleSubmitButtonClick={isSubmitButtonVisible ? resendPushNotification : undefined}
    >
      <CountdownCircle
        // Force rerender (please see "AnimatedCircle" component)
        key={`countdownCircle-${retriesCount}`}
        secondsAmount={TOKEN_EXPIRATION_TIME_SECONDS}
        timeLeft={timeLeft}
      />
      <Spacer h="px32" />
      <H2>{t(getTitleKey(isSignInErrorOrTimeOut))}</H2>
      <ScreenDescription
        phoneNumber={plainPhoneNumber}
        isStepUp={Boolean(beforeStepUpUrl)}
        onUseDifferentMethod={handleUseDifferentMethod}
      />
    </AuthLayout>
  )
}
