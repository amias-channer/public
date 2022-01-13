import { useCallback, useState } from 'react'

import { useRunAuthFlowElements } from '../hooks'
import { SignUpScreenComponent } from '../types'
import { getUserAuthFlowElement } from '../utils'
import { ConfirmationScreen } from './ConfirmationScreen'
import { InitialScreen } from './InitialScreen'

export const PasscodeScreen: SignUpScreenComponent = ({ goToNextScreen }) => {
  const [initialPasscode, setInitialPasscode] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [runAuthFlowElements, isLoading] = useRunAuthFlowElements()

  const handleConfirmationPasscode = useCallback(
    async (value: string) => {
      if (value === initialPasscode) {
        if (isLoading) {
          return
        }

        await runAuthFlowElements(
          {
            password: value,
          },
          {
            onSuccess: ({ data }) => {
              goToNextScreen(getUserAuthFlowElement(data))
            },
            onError: () => {
              setHasError(true)
            },
          },
        )
      } else {
        setHasError(true)
        setInitialPasscode('')
      }
    },
    [initialPasscode, isLoading, runAuthFlowElements, goToNextScreen],
  )

  const handleConfirmationScreenBackButtonClick = useCallback(() => {
    setHasError(false)
    setInitialPasscode('')
  }, [])

  return !initialPasscode ? (
    <InitialScreen hasError={hasError} onPasscodeConfirm={setInitialPasscode} />
  ) : (
    <ConfirmationScreen
      onBackButtonClick={handleConfirmationScreenBackButtonClick}
      onPasscodeConfirm={handleConfirmationPasscode}
    />
  )
}
