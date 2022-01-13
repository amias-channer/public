import React, { FC } from 'react'
import { Fixed, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { Z_INDICES } from '@revolut/rwa-core-styles'
import { VerificationMethod } from '@revolut/rwa-core-types'

import { OtpScreen } from './OtpScreen'
import { PasscodeScreen } from './PasscodeScreen'

type VerificationStepsProps = {
  shouldShowError: boolean
  verificationMethod?: string
  onDisableError: VoidFunction
  onVerificationMethodChange: (method: string) => void
  onPasscodeChange: (passcode: string) => void
  onOtpCodeChange: (otpCode: string) => void
}

const VerificationScreenContainerTestId = 'verification-screen'

export const VerificationSteps: FC<VerificationStepsProps> = ({
  shouldShowError,
  verificationMethod,
  onDisableError,
  onVerificationMethodChange,
  onPasscodeChange,
  onOtpCodeChange,
}) => {
  const handleExitVerificationProcess = () => {
    onVerificationMethodChange('')
  }

  const getMethodLayout = () => {
    switch (verificationMethod) {
      case VerificationMethod.Password:
        return (
          <PasscodeScreen
            shouldShowError={shouldShowError}
            onErrorMessageClear={onDisableError}
            onBackButtonClick={handleExitVerificationProcess}
            onPasscodeSubmit={onPasscodeChange}
          />
        )
      case VerificationMethod.Sms:
        return (
          <OtpScreen
            shouldShowError={shouldShowError}
            onErrorMessageClear={onDisableError}
            onBackButtonClick={handleExitVerificationProcess}
            onCodeSubmit={onOtpCodeChange}
          />
        )
      default:
        throw new Error(`verification method ${verificationMethod} was not handled`)
    }
  }

  return (
    <ThemeProvider theme={UnifiedTheme}>
      {verificationMethod && (
        <Fixed
          data-testid={VerificationScreenContainerTestId}
          left={0}
          top={0}
          minHeight="100vh"
          minWidth="100vw"
          zIndex={Z_INDICES.verificationMethodScreen}
        >
          {getMethodLayout()}
        </Fixed>
      )}
    </ThemeProvider>
  )
}
