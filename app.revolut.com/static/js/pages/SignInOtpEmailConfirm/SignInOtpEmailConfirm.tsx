import { parsePhoneNumber } from 'libphonenumber-js'
import qs from 'qs'
import { FC, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useAuthContext, SignInFlowChannel } from '@revolut/rwa-core-auth'
import { PhoneNumberValue } from '@revolut/rwa-core-types'
import {
  browser,
  checkRequired,
  Url,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { useBroadcast } from './hooks'
import { LoaderScreen } from './LoaderScreen'
import { isValidSecurityCode, parseSecurityCode } from './utils'
import { WrongDeviceScreen } from './WrongDeviceScreen'

export const SignInOtpEmailConfirm: FC = () => {
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()
  const { phoneNumber, setSignInFlowChannel, setPhoneNumber, setSecurityCode } =
    useAuthContext()
  const [isWrongDeviceScreenShown, setWrongDeviceScreenShown] = useState(false)

  const { phone, token } = qs.parse(browser.getSearch()) as {
    phone?: string
    token?: string
  }
  const securityCode = parseSecurityCode(token)

  const navigateToSignIn = useCallback(
    (newPhoneNumber: PhoneNumberValue) => {
      setSignInFlowChannel(SignInFlowChannel.EmailLink)
      setPhoneNumber(newPhoneNumber)
      setSecurityCode(securityCode)

      history.push(Url.SignIn)
    },
    [history, securityCode, setSignInFlowChannel, setPhoneNumber, setSecurityCode],
  )

  const handleBroadcastError = useCallback(() => {
    setWrongDeviceScreenShown(true)
  }, [setWrongDeviceScreenShown])

  useBroadcast({
    onSuccess: navigateToSignIn,
    onError: handleBroadcastError,
  })

  useEffect(() => {
    if (!isValidSecurityCode(securityCode)) {
      navigateToErrorPage('Invalid security code')
    }
  }, [securityCode, navigateToErrorPage])

  useEffect(() => {
    if (!phone || phoneNumber.number) {
      return
    }

    const parsedPhoneNumber = parsePhoneNumber(phone)

    navigateToSignIn({
      code: checkRequired(parsedPhoneNumber.country, '"code" can not be empty'),
      number: parsedPhoneNumber.nationalNumber.toString(),
    })
  }, [phone, phoneNumber.number, navigateToSignIn])

  return isWrongDeviceScreenShown ? <WrongDeviceScreen /> : <LoaderScreen />
}
