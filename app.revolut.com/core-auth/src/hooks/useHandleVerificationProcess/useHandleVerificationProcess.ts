import { AxiosError } from 'axios'
import { useCallback, useMemo, useState } from 'react'

import { ApiErrorCode, HttpCode, HttpHeader, useLatestRef } from '@revolut/rwa-core-utils'

type VerificationHeaders = {
  [HttpHeader.VerifyCode]?: string
  [HttpHeader.VerifyPassword]?: string
}

export type VerificationConfig = {
  headers: VerificationHeaders
}

export const useHandleVerificationProcess = (onError?: (error: AxiosError) => void) => {
  const [currentVerificationMethod, setCurrentVerificationMethod] = useState<string>()
  const [shouldShowError, setShouldShowError] = useState(false)
  const [config, setConfig] = useState<VerificationConfig>()

  const onErrorRef = useLatestRef(onError)

  const handleDisableError = useCallback(() => {
    setShouldShowError(false)
  }, [])

  const resetVerificationProcess = useCallback(() => {
    setCurrentVerificationMethod('')
    setConfig(undefined)
    handleDisableError()
  }, [handleDisableError])

  const handleError = useCallback(
    (error: AxiosError) => {
      const errorStatus = error.response?.status
      const errorCode = error.response?.data?.code

      if (
        errorStatus === HttpCode.UnprocessableEntity &&
        errorCode === ApiErrorCode.VerificationRequired
      ) {
        setCurrentVerificationMethod(error.response?.data.method)

        return
      }

      if (
        errorCode === ApiErrorCode.ExistingPasscodeIncorrect ||
        errorCode === ApiErrorCode.OtpIncorrect
      ) {
        setShouldShowError(true)

        return
      }

      resetVerificationProcess()
      onErrorRef.current?.(error)
    },
    [onErrorRef, resetVerificationProcess],
  )

  const handleSuccess = useCallback(() => {
    resetVerificationProcess()
  }, [resetVerificationProcess])

  const handleVerificationMethodChange = useCallback(
    (method: string) => {
      if (!method) {
        resetVerificationProcess()
      } else {
        setCurrentVerificationMethod(method)
      }
    },
    [resetVerificationProcess],
  )

  const handlePasscodeChange = useCallback(
    (passcode: string) => {
      setConfig({
        headers: {
          ...(config && config.headers),
          [HttpHeader.VerifyPassword]: passcode,
        },
      })
    },
    [config],
  )

  const handleOtpChange = useCallback(
    (otpCode: string) => {
      setConfig({
        headers: {
          ...(config && config.headers),
          [HttpHeader.VerifyCode]: otpCode,
        },
      })
    },
    [config],
  )

  return {
    config,
    onError: handleError,
    onSuccess: handleSuccess,
    verificationStepsProps: useMemo(
      () => ({
        shouldShowError,
        onDisableError: handleDisableError,
        verificationMethod: currentVerificationMethod,
        onVerificationMethodChange: handleVerificationMethodChange,
        onPasscodeChange: handlePasscodeChange,
        onOtpCodeChange: handleOtpChange,
      }),
      [
        currentVerificationMethod,
        handleDisableError,
        handleOtpChange,
        handlePasscodeChange,
        handleVerificationMethodChange,
        shouldShowError,
      ],
    ),
  }
}
