import { FC, useCallback, useState } from 'react'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { UserAuthFlowElement } from '@revolut/rwa-core-types'
import { AxiosSecurity, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { ALIASES, SCREENS } from './constants'
import { SignUpScreen } from './enums'
import { useRunAuthFlowComplete } from './hooks'

const INITIAL_SCREEN_ELEMENT = SignUpScreen.Passcode

export const SignUp: FC = () => {
  const navigateToErrorPage = useNavigateToErrorPage()
  const { flowItem, setAuthorized } = useAuthContext()
  const [currentScreen, setCurrentScreen] = useState(
    flowItem?.element
      ? ALIASES[flowItem.element as UserAuthFlowElement]
      : INITIAL_SCREEN_ELEMENT,
  )
  const runAuthFlowComplete = useRunAuthFlowComplete()

  const handleGoToNextScreen = useCallback(
    async (nextElement?: string) => {
      if (nextElement) {
        const screen = ALIASES[nextElement]
        if (screen) {
          setCurrentScreen(screen)
        } else {
          navigateToErrorPage(`Element is not supported: ${nextElement}`)
        }
      } else {
        await runAuthFlowComplete(undefined, {
          onSuccess: ({ data }) => {
            AxiosSecurity.saveUsernameAndPasswordToStorage(data.user.id, data.accessToken)
            AxiosSecurity.updateApiAuthHeaderFromStorage()
            setAuthorized(true)

            setCurrentScreen(SignUpScreen.Success)
          },
        })
      }
    },
    [navigateToErrorPage, runAuthFlowComplete, setAuthorized],
  )

  const CurrentScreenComponent = SCREENS[currentScreen]

  return (
    <>
      <CurrentScreenComponent goToNextScreen={handleGoToNextScreen} />
    </>
  )
}
