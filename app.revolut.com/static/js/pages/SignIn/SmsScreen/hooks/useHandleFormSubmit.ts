import { AxiosError } from 'axios'
import { FormikHelpers } from 'formik'
import { useCallback } from 'react'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { GeneralErrorDto, PhoneNumberValue } from '@revolut/rwa-core-types'
import { formatPhoneNumber } from '@revolut/rwa-core-utils'

import { useAuthorizeUserWithoutSelfie, useSignInConfirm } from 'hooks'

import { FormFieldName } from '../form'
import { FormValues } from '../types'

type UseHandleFormSubmitArgs = {
  phoneNumber: PhoneNumberValue
  onSubmitSuccess: () => void
  onSubmitError: (e?: AxiosError<GeneralErrorDto>) => void
}

export const useHandleFormSubmit = ({
  phoneNumber,
  onSubmitSuccess,
  onSubmitError,
}: UseHandleFormSubmitArgs) => {
  const { passcode, setSecurityCode } = useAuthContext()
  const { signInConfirm } = useSignInConfirm()
  const authorizeUserWithoutSelfie = useAuthorizeUserWithoutSelfie()

  const plainPhoneNumber = formatPhoneNumber(phoneNumber)

  return useCallback(
    async (
      { securityCode }: FormValues,
      { setSubmitting, setFieldValue }: FormikHelpers<FormValues>,
    ) => {
      const stopAutoSubmitting = () => {
        setFieldValue(FormFieldName.SecurityCode, '')
        setSubmitting(false)
      }

      stopAutoSubmitting()

      const runSignInStep = async () => {
        await signInConfirm(
          {
            phone: plainPhoneNumber,
            password: passcode,
            code: securityCode,
          },
          {
            onSuccess: () => {
              onSubmitSuccess()
            },

            onError: (e: AxiosError<GeneralErrorDto>) => {
              onSubmitError(e)
            },
          },
        )
      }

      const runVerifyOtpStep = async () => {
        stopAutoSubmitting()

        await signInConfirm(
          {
            phone: plainPhoneNumber,
            code: securityCode,
          },
          {
            onSuccess: async () => {
              setSecurityCode(securityCode)

              if (getConfigValue<boolean>(ConfigKey.CookieAuth)) {
                await authorizeUserWithoutSelfie({ securityCode })
              } else {
                await runSignInStep()
              }
            },
            onError: () => {
              onSubmitError()
            },
          },
        )
      }

      await runVerifyOtpStep()
    },
    [
      onSubmitError,
      onSubmitSuccess,
      passcode,
      plainPhoneNumber,
      setSecurityCode,
      signInConfirm,
      authorizeUserWithoutSelfie,
    ],
  )
}
