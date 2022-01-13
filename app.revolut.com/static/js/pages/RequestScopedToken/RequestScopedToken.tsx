import { FC, useCallback, useState } from 'react'

import { BeforeYouStartScreen } from './BeforeYouStartScreen'
import { CameraAccessDeniedScreen } from './CameraAccessDeniedScreen'
import { ConfirmSelfieScreen } from './ConfirmSelfieScreen'
import { RequestScopedTokenScreen } from './constants'
import { IdentityVerificationFailedScreen } from './IdentityVerificationFailedScreen'
import { RequestScopedTokenProvider } from './RequestScopedTokenProvider'
import { SelfieDidNotMatchScreen } from './SelfieDidNotMatchScreen'
import { SelfieUploadFailedScreen } from './SelfieUploadFailedScreen'
import { TakeSelfieScreen } from './TakeSelfieScreen'
import {
  RequestScopedTokenScreenChangeFunc,
  RequestScopedTokenScreenProps,
} from './types'

const SCREENS: { [T in RequestScopedTokenScreen]: FC<RequestScopedTokenScreenProps> } = {
  [RequestScopedTokenScreen.BeforeYouStart]: BeforeYouStartScreen,
  [RequestScopedTokenScreen.CameraAccessDeniedScreen]: CameraAccessDeniedScreen,
  [RequestScopedTokenScreen.ConfirmSelfie]: ConfirmSelfieScreen,
  [RequestScopedTokenScreen.IdentityVerificationFailed]: IdentityVerificationFailedScreen,
  [RequestScopedTokenScreen.SelfieDidNotMatch]: SelfieDidNotMatchScreen,
  [RequestScopedTokenScreen.SelfieUploadFailedScreen]: SelfieUploadFailedScreen,
  [RequestScopedTokenScreen.TakeSelfie]: TakeSelfieScreen,
}

export const RequestScopedToken = () => {
  const [currentScreen, setCurrentScreen] = useState<RequestScopedTokenScreen>(
    RequestScopedTokenScreen.BeforeYouStart,
  )

  const handleScreenChange = useCallback<RequestScopedTokenScreenChangeFunc>(
    (nextScreen) => {
      setCurrentScreen(nextScreen)
    },
    [setCurrentScreen],
  )

  const CurrentScreenComponent = SCREENS[currentScreen]

  return (
    <RequestScopedTokenProvider>
      <CurrentScreenComponent onScreenChange={handleScreenChange} />
    </RequestScopedTokenProvider>
  )
}
