import { AxiosError } from 'axios'
import { FormikHelpers } from 'formik'
import { useCallback } from 'react'

import { GeneralErrorDto, SignInOtpChannel, Xor } from '@revolut/rwa-core-types'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { useAuthContext, SignInFlowChannel } from '@revolut/rwa-core-auth'
import { ApiErrorCode, formatPhoneNumber, HttpCode, Url } from '@revolut/rwa-core-utils'

import { useSignInConfirm, useAuthorizeUserWithoutSelfie } from 'hooks'

import { SignInScreen } from '../../constants'
import { isErrorMatchesGivenCodes } from '../../utils'
import { FormFieldName } from '../form'
import { FormValues } from '../types'
import { useSignIn } from './api'

const shouldVerifyIdentity = (e: AxiosError) =>
  isErrorMatchesGivenCodes(
    e,
    HttpCode.UnprocessableEntity,
    ApiErrorCode.ActionRequiresKyc,
  )

const shouldUseAppOtpChannel = (flowChannel?: SignInFlowChannel) =>
  !flowChannel || flowChannel === SignInFlowChannel.PushNotification

type UseHandleFormSubmitArgs = {
  onSubmitSuccess: (next: Xor<{ screen: SignInScreen }, { url: Url }>) => void
  onSubmitError: (e: AxiosError<GeneralErrorDto>) => void
}

export const useHandleFormSubmit = ({
  onSubmitSuccess,
  onSubmitError,
}: UseHandleFormSubmitArgs) => {
  const {
    beforeStepUpUrl,
    signInFlowChannel,
    phoneNumber,
    securityCode,
    setPasscode,
    setPushTokenId,
  } = useAuthContext()
  const { signIn } = useSignIn()
  const { signInConfirm } = useSignInConfirm()
  const authorizeUserWithoutSelfie = useAuthorizeUserWithoutSelfie()

  return useCallback(
    async (
      { passcode }: FormValues,
      { setSubmitting, setFieldValue }: FormikHelpers<FormValues>,
    ) => {
      const stopAutoSubmitting = () => {
        setFieldValue(FormFieldName.Passcode, '')
        setSubmitting(false)
      }

      const runSignInStep = async () => {
        stopAutoSubmitting()

        await signIn(
          {
            phone: formatPhoneNumber(phoneNumber),
            channel: SignInOtpChannel.App,
            password: passcode,
          },
          {
            onSuccess({ data }) {
              setPasscode(passcode)
              setPushTokenId(data.tokenId)

              onSubmitSuccess({ screen: SignInScreen.PushNotification })
            },
            onError(e) {
              if (
                isErrorMatchesGivenCodes(
                  e,
                  HttpCode.BadRequest,
                  ApiErrorCode.UnsupportedAppVersion,
                )
              ) {
                const isStepUp = Boolean(beforeStepUpUrl)
                // Passcode is valid, but user doesn't have a mobile for consent
                setPasscode(passcode)

                if (getConfigValue<boolean>(ConfigKey.CookieAuth) && isStepUp) {
                  // HACK! User will never receive a push notification in this case
                  onSubmitSuccess({ screen: SignInScreen.PushNotification })
                } else {
                  onSubmitSuccess({ screen: SignInScreen.AuthenticationMethod })
                }
              } else {
                onSubmitError(e)
              }
            },
          },
        )
      }

      const runSignInConfirmStep = async () => {
        stopAutoSubmitting()

        await signInConfirm(
          {
            phone: formatPhoneNumber(phoneNumber),
            code: securityCode,
            password: passcode,
          },
          {
            onSuccess: () => {
              setPasscode(passcode)
              onSubmitSuccess({ url: Url.RequestScopedToken })
            },

            onError: (e) => {
              if (shouldVerifyIdentity(e)) {
                onSubmitSuccess({ url: Url.VerifyYourIdentity })
              } else {
                onSubmitError(e)
              }
            },
          },
        )
      }

      const runAuthorizeUserWithoutSelfie = async () => {
        stopAutoSubmitting()

        await authorizeUserWithoutSelfie({ passcode })
      }

      if (shouldUseAppOtpChannel(signInFlowChannel)) {
        await runSignInStep()
      } else if (getConfigValue<boolean>(ConfigKey.CookieAuth)) {
        await runAuthorizeUserWithoutSelfie()
      } else {
        await runSignInConfirmStep()
      }
    },
    [
      beforeStepUpUrl,
      phoneNumber,
      securityCode,
      signInFlowChannel,
      signIn,
      signInConfirm,
      setPasscode,
      setPushTokenId,
      authorizeUserWithoutSelfie,
      onSubmitError,
      onSubmitSuccess,
    ],
  )
}
