import { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Url } from '@revolut/rwa-core-utils'

import { ChangePhoneNumberProvider } from './ChangePhoneNumberProvider'
import { ChangePhoneNumberScreen } from './constants'
import { NewPhoneNumberOtpScreen } from './NewPhoneNumberOtpScreen'
import { NewPhoneNumberScreen } from './NewPhoneNumberScreen'
import { SuccessScreen } from './SuccessScreen'

export const ChangePhoneNumber: FC = () => {
  const history = useHistory()
  const [currentScreen, setCurrentScreen] = useState(
    ChangePhoneNumberScreen.NewPhoneNumber,
  )

  const goToPersonalDetails = () => {
    history.push(Url.PersonalDetails)
  }

  const handleNewPhoneNumberSubmit = () => {
    setCurrentScreen(ChangePhoneNumberScreen.NewPhoneNumberOtp)
  }

  const handleNewPhoneNumberOtpBackButtonClick = () => {
    setCurrentScreen(ChangePhoneNumberScreen.NewPhoneNumber)
  }

  const handleNewPhoneNumberOtpConfirmed = () => {
    setCurrentScreen(ChangePhoneNumberScreen.SuccessScreen)
  }

  const handleCloseButtonClick = () => {
    history.push(Url.PersonalDetails)
  }

  const getCurrentScreenComponent = () => {
    switch (currentScreen) {
      case ChangePhoneNumberScreen.NewPhoneNumber:
        return (
          <NewPhoneNumberScreen
            onBackButtonClick={goToPersonalDetails}
            onConfirm={handleNewPhoneNumberSubmit}
          />
        )
      case ChangePhoneNumberScreen.NewPhoneNumberOtp:
        return (
          <NewPhoneNumberOtpScreen
            onBackButtonClick={handleNewPhoneNumberOtpBackButtonClick}
            onCloseButtonClick={handleCloseButtonClick}
            onConfirm={handleNewPhoneNumberOtpConfirmed}
          />
        )
      case ChangePhoneNumberScreen.SuccessScreen:
        return <SuccessScreen />
      default:
        throw new Error(
          `ChangePhoneNumber screen ${currentScreen} not reachable. It needs to be handled.`,
        )
    }
  }

  return (
    <ChangePhoneNumberProvider>{getCurrentScreenComponent()}</ChangePhoneNumberProvider>
  )
}
