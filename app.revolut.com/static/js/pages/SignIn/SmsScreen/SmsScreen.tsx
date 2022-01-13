import { AxiosError } from 'axios'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { trackEvent, SignInTrackingEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext, SignInFlowChannel } from '@revolut/rwa-core-auth'
import {
  AuthLayout,
  Illustration,
  IllustrationAssetId,
  Spacer,
  TextBox,
  useForm,
} from '@revolut/rwa-core-components'
import { SignInOtpChannel } from '@revolut/rwa-core-types'
import {
  ApiErrorCode,
  formatPhoneNumber,
  HttpCode,
  Url,
  useInputShaking,
} from '@revolut/rwa-core-utils'

import { useFormAutoSubmit } from 'hooks'

import { I18N_NAMESPACE, SignInScreen } from '../constants'
import { SignInScreenProps } from '../types'
import { isErrorMatchesGivenCodes } from '../utils'
import { DevOtpCode } from './DevOtpCode'
import { formValidationSchema, createFormSchema, FormFieldName } from './form'
import { useHandleFormSubmit, useSignIn, useQueryVerificationCode } from './hooks'
import { ScreenDescription } from './ScreenDescription'

const INPUT_SHAKING_TIMEOUT = 1000

const isInvalidPasscode = (e: AxiosError) =>
  isErrorMatchesGivenCodes(e, HttpCode.Unauthorized, ApiErrorCode.Unauthorised)

export const SmsScreen: FC<SignInScreenProps> = ({ onScreenChange }) => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)
  const { phoneNumber, setSignInFlowChannel } = useAuthContext()
  const { shakeInput, isInputShaking } = useInputShaking(INPUT_SHAKING_TIMEOUT)
  const [securityCodeError, setSecurityCodeError] = useState<string>()

  const { signIn } = useSignIn()

  useEffect(() => {
    trackEvent(SignInTrackingEvent.smsAuthScreenOpened)

    return () => {
      trackEvent(SignInTrackingEvent.smsAuthScreenClosed)
    }
  }, [])

  const handleSubmitSuccess = useCallback(() => {
    trackEvent(SignInTrackingEvent.smsOtpSubmitSucceeded)

    if (!getConfigValue<boolean>(ConfigKey.CookieAuth)) {
      history.push(Url.RequestScopedToken)
    }
  }, [history])

  const handleSubmitError = useCallback(
    (e?: AxiosError) => {
      if (e && isInvalidPasscode(e)) {
        onScreenChange(SignInScreen.Passcode)
        trackEvent(SignInTrackingEvent.smsOtpSubmitFailed, {
          reason: 'INVALID_PASSCODE',
        })

        return
      }

      trackEvent(SignInTrackingEvent.smsOtpSubmitFailed, {
        reason: 'SmsScreen.verificationCode.error.incorrect',
      })
      shakeInput()
      setSecurityCodeError(t('SmsScreen.verificationCode.error.incorrect'))
    },
    [onScreenChange, shakeInput, setSecurityCodeError, t],
  )

  const code = useQueryVerificationCode(phoneNumber)
  const handleFormSubmit = useHandleFormSubmit({
    phoneNumber,
    onSubmitSuccess: handleSubmitSuccess,
    onSubmitError: handleSubmitError,
  })

  const formSchema = createFormSchema(isInputShaking, securityCodeError)

  const { FormComponent, formProps, formik } = useForm({
    formSchema,
    validationSchema: formValidationSchema,
    onSubmit: handleFormSubmit,
  })

  useFormAutoSubmit(formik)

  const handleDevOtpCodeClick = useCallback(
    (devOtpCode: string) => {
      formik.setFieldValue(FormFieldName.SecurityCode, devOtpCode)
    },
    [formik],
  )

  const handleBackButtonClick = useCallback(() => {
    onScreenChange(SignInScreen.AuthenticationMethod)
  }, [onScreenChange])

  useEffect(() => {
    setSignInFlowChannel(SignInFlowChannel.Sms)
  }, [setSignInFlowChannel])

  useEffect(() => {
    signIn({
      phone: formatPhoneNumber(phoneNumber),
      channel: SignInOtpChannel.Sms,
    })
  }, [phoneNumber, signIn])

  return (
    <AuthLayout
      title={t('SmsScreen.title', {
        phoneNumber: formatPhoneNumber(phoneNumber),
      })}
      description={
        <>
          <ScreenDescription />
          {code && <DevOtpCode code={code} onClick={handleDevOtpCodeClick} />}
        </>
      }
      illustration={<Illustration assetId={IllustrationAssetId.OtpViaSms} />}
      handleBackButtonClick={handleBackButtonClick}
    >
      <FormComponent {...formProps} />

      <Spacer h="px48" />

      <TextBox>{t('SmsScreen.limitedAccessText')}</TextBox>
    </AuthLayout>
  )
}
