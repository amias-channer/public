import { FC, useCallback, useState, useEffect } from 'react'

import { trackEvent, SignInTrackingEvent } from '@revolut/rwa-core-analytics'

import { AuthenticationMethodScreen } from './AuthenticationMethodScreen'
import { SignInScreen } from './constants'
import { EmailScreen } from './EmailScreen'
import { PasscodeScreen } from './PasscodeScreen'
import { PushNotificationScreen } from './PushNotificationScreen'
import { SmsScreen } from './SmsScreen'
import { SignInScreenChangeFunc, SignInScreenProps } from './types'

const SCREENS: { [T in SignInScreen]: FC<SignInScreenProps> } = {
  [SignInScreen.AuthenticationMethod]: AuthenticationMethodScreen,
  [SignInScreen.Email]: EmailScreen,
  [SignInScreen.Passcode]: PasscodeScreen,
  [SignInScreen.PushNotification]: PushNotificationScreen,
  [SignInScreen.Sms]: SmsScreen,
}

export const SignIn: FC = () => {
  const [currentScreen, setCurrentScreen] = useState<SignInScreen>(SignInScreen.Passcode)

  useEffect(() => {
    trackEvent(SignInTrackingEvent.signInStarted)
  }, [])

  const handleScreenChange = useCallback<SignInScreenChangeFunc>(
    (nextScreen) => {
      trackEvent(SignInTrackingEvent.screenChanged, { screen: nextScreen })
      setCurrentScreen(nextScreen)
    },
    [setCurrentScreen],
  )

  const CurrentScreenComponent = SCREENS[currentScreen]

  return <CurrentScreenComponent onScreenChange={handleScreenChange} />
}
