import { AxiosError } from 'axios'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { TextButton } from '@revolut/ui-kit'
import * as Sentry from '@sentry/react'

import { trackEvent, SignInTrackingEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext, SignInFlowChannel } from '@revolut/rwa-core-auth'
import { AuthLayout, Spacer, useForm } from '@revolut/rwa-core-components'
import { ConfigKey, getConfigValue, isDevelopmentEnv } from '@revolut/rwa-core-config'
import { GeneralErrorDto, Xor } from '@revolut/rwa-core-types'
import {
  ApiErrorCode,
  buildSentryContext,
  checkRequired,
  defaultStorage,
  DefaultStorageKey,
  HttpCode,
  SentryTag,
  Url,
  useInputShaking,
} from '@revolut/rwa-core-utils'
import { useCommonConfig } from '@revolut/rwa-core-api'

import { useCountdown, useFormAutoSubmit } from 'hooks'

import { I18N_NAMESPACE, SignInScreen } from '../constants'
import { SignInScreenProps } from '../types'
import { isErrorMatchesGivenCodes } from '../utils'
import { createFormSchema, formValidationSchema, PasscodeError } from './form'
import { useHandleFormSubmit } from './hooks'

const INPUT_SHAKING_TIMEOUT = 1000
const DEV_SIGN_IN_LOCKOUT_SECONDS = 5

const getInitials = (flowChannel: SignInFlowChannel | undefined) => {
  // Show the error if the flow type is known
  // (there was a redirect back to the "pass code" screen)
  const shouldShowInitialError =
    flowChannel && flowChannel !== SignInFlowChannel.EmailLink
  const savedBlockedTime =
    defaultStorage.getItem<number>(DefaultStorageKey.PasscodeBlockedTime) ?? 0

  const countdownTimeLeft = Math.max((savedBlockedTime - Date.now()) / 1000, 0)
  const passcodeError =
    (countdownTimeLeft > 0 ? PasscodeError.Blocked : undefined) ||
    (shouldShowInitialError ? PasscodeError.Incorrect : undefined)

  return {
    countdownTimeLeft,
    passcodeError,
  }
}

export const PasscodeScreen: FC<SignInScreenProps> = ({ onScreenChange }) => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)
  const { signInFlowChannel, beforeStepUpUrl } = useAuthContext()
  const [commonConfig] = useCommonConfig()

  const initials = getInitials(signInFlowChannel)

  const {
    timeLeft: countdownTimeLeft,
    isFinished: isCountdownFinished,
    restartCountdown,
  } = useCountdown(initials.countdownTimeLeft)
  const { shakeInput, isInputShaking } = useInputShaking(INPUT_SHAKING_TIMEOUT)
  const [passcodeError, setPasscodeError] = useState<PasscodeError | undefined>(
    initials.passcodeError,
  )
  const [passcodeErrorMessage, setPasscodeErrorMessage] = useState<string | undefined>()

  useEffect(() => {
    trackEvent(SignInTrackingEvent.passcodeScreenOpened)
    return () => {
      trackEvent(SignInTrackingEvent.passcodeScreenClosed)
    }
  }, [])

  const handleSubmitSuccess = useCallback(
    (next: Xor<{ screen: SignInScreen }, { url: Url }>) => {
      const attemptNumber =
        defaultStorage.getItem<number>(DefaultStorageKey.PasscodeAttemptCount) ?? 1

      trackEvent(SignInTrackingEvent.passcodeSubmitSucceeded, {
        attemptNumber,
        source: signInFlowChannel,
      })

      defaultStorage.removeItem(DefaultStorageKey.PasscodeAttemptCount)
      defaultStorage.removeItem(DefaultStorageKey.PasscodeBlockedTime)

      if (next.screen) {
        onScreenChange(next.screen)
      } else {
        history.push(next.url)
      }
    },
    [history, onScreenChange, signInFlowChannel],
  )

  const handleSubmitError = useCallback(
    (e: AxiosError<GeneralErrorDto>) => {
      shakeInput()

      // User entered incorrect password or has exceeded the limit
      // (entered the wrong password 3 times)
      const attemptCount =
        (defaultStorage.getItem<number>(DefaultStorageKey.PasscodeAttemptCount) ?? 0) + 1

      if (
        !isErrorMatchesGivenCodes(e, HttpCode.Unauthorized, ApiErrorCode.Unauthorised)
      ) {
        setPasscodeError(PasscodeError.Unknown)
        trackEvent(SignInTrackingEvent.passcodeSubmitFailed, {
          reason: e.response?.data?.message,
          attemptNumber: attemptCount,
          source: signInFlowChannel,
        })

        Sentry.captureException(e, {
          extra: {
            'response.data': e.response?.data,
          },
          tags: {
            [SentryTag.Context]: buildSentryContext([
              'sign in',
              'passcode screen',
              'unknown error',
            ]),
          },
        })

        return
      }

      defaultStorage.setItem(DefaultStorageKey.PasscodeAttemptCount, attemptCount)

      if (attemptCount < checkRequired(commonConfig?.signInMaxAttempts)) {
        setPasscodeError(PasscodeError.Incorrect)
        trackEvent(SignInTrackingEvent.passcodeSubmitFailed, {
          reason: PasscodeError.Incorrect,
          attemptNumber: attemptCount,
          source: signInFlowChannel,
        })
        return
      }

      const signInLockoutSeconds = isDevelopmentEnv()
        ? DEV_SIGN_IN_LOCKOUT_SECONDS
        : checkRequired(commonConfig?.signInLockoutMinutes) * 60

      defaultStorage.setItem(
        DefaultStorageKey.PasscodeBlockedTime,
        Date.now() + signInLockoutSeconds * 1000,
      )

      restartCountdown(signInLockoutSeconds)
      setPasscodeError(PasscodeError.Blocked)
    },
    [
      shakeInput,
      commonConfig?.signInMaxAttempts,
      commonConfig?.signInLockoutMinutes,
      restartCountdown,
      signInFlowChannel,
    ],
  )

  const handleFormSubmit = useHandleFormSubmit({
    onSubmitSuccess: handleSubmitSuccess,
    onSubmitError: handleSubmitError,
  })

  const formSchema = createFormSchema(
    isInputShaking,
    !isCountdownFinished,
    passcodeErrorMessage,
  )

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema: formValidationSchema,
    onSubmit: handleFormSubmit,
  })

  useFormAutoSubmit(formik)

  const handleBackButtonClick = useCallback(() => {
    history.push(beforeStepUpUrl ?? Url.Start)
  }, [history, beforeStepUpUrl])

  const handleForgotPasswordLinkClick = () => {
    trackEvent(SignInTrackingEvent.forgotPasswordClicked, {
      source: signInFlowChannel,
    })
  }

  useEffect(() => {
    if (passcodeError === undefined) {
      setPasscodeErrorMessage(undefined)

      return
    }

    switch (passcodeError) {
      case PasscodeError.Incorrect:
        setPasscodeErrorMessage(t('PasscodeScreen.passcode.error.incorrect'))
        break
      case PasscodeError.Blocked:
        setPasscodeErrorMessage(
          t('PasscodeScreen.passcode.error.blocked', {
            timeLeft: countdownTimeLeft,
          }),
        )
        break
      case PasscodeError.Unknown:
        setPasscodeErrorMessage(t('PasscodeScreen.passcode.error.unknown'))
        break
      default:
        throw new Error(
          `Unknown passcode error: ${passcodeError}. It needs to be handled.`,
        )
    }
  }, [countdownTimeLeft, passcodeError, setPasscodeErrorMessage, t])

  useEffect(() => {
    if (isCountdownFinished) {
      setPasscodeError((prevValue) =>
        prevValue === PasscodeError.Blocked ? undefined : prevValue,
      )
    }
  }, [isCountdownFinished, setPasscodeError])

  return (
    <AuthLayout
      title={t('PasscodeScreen.title')}
      description={t('PasscodeScreen.description')}
      handleBackButtonClick={handleBackButtonClick}
    >
      <FormComponent {...formProps} />

      <Spacer h="px24" />

      <TextButton
        use="a"
        href={getConfigValue(ConfigKey.ForgotMyPasscodeUrl)}
        target="_blank"
        variant="primary"
        onClick={handleForgotPasswordLinkClick}
      >
        {t('PasscodeScreen.forgotYourPasscode')}
      </TextButton>
    </AuthLayout>
  )
}
