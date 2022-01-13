import { FC, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { FullPageLoader, useModal } from '@revolut/rwa-core-components'
import { ApiErrorCode, Url, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { ExistingPasscodeIncorrectModal, PasscodesNotMatchModal } from 'components'

import { ChangePasscodeScreen } from './constants'
import { ExistingPasscodeScreen } from './ExistingPasscodeScreen'
import { useChangeUserPasscode } from './hooks'
import { PasscodeConfirmationScreen } from './PasscodeConfirmationScreen'
import { PasscodeCreationScreen } from './PasscodeCreationScreen'
import { SuccessScreen } from './SuccessScreen'
import { PasscodesRef } from './types'

export const ChangePasscode: FC = () => {
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()
  const [currentScreen, setCurrentScreen] = useState(
    ChangePasscodeScreen.ExistingPasscode,
  )
  const passcodesRef = useRef<PasscodesRef>({} as PasscodesRef)
  const [showPasscodeNotMatchModal, passcodeNotMatchModalProps] = useModal()
  const [showExistingPasscodeIncorrectModal, existingPasscodeIncorrectModalProps] =
    useModal()
  const { changePasscode, isLoading } = useChangeUserPasscode()

  const handleExistingPasscodeChange = (existingPasscode: string) => {
    passcodesRef.current.existingPasscode = existingPasscode
    setCurrentScreen(ChangePasscodeScreen.PasscodeCreation)
  }

  const handleNewPasscodeChange = (newPasscode: string) => {
    passcodesRef.current.newPasscode = newPasscode
    setCurrentScreen(ChangePasscodeScreen.PasscodeConfirmation)
  }

  const handlePasscodeCreationBackButtonClick = () => {
    setCurrentScreen(ChangePasscodeScreen.ExistingPasscode)
  }

  const handleNewPasscodeConfirmed = (confirmedPasscode: string) => {
    if (passcodesRef.current.newPasscode !== confirmedPasscode) {
      showPasscodeNotMatchModal()
      return
    }

    const { existingPasscode, newPasscode } = passcodesRef.current

    changePasscode(
      { oldPassword: existingPasscode, password: newPasscode },
      {
        onSuccess: () => {
          setCurrentScreen(ChangePasscodeScreen.SuccessScreen)
        },
        onError: (error) => {
          if (error.response?.data.code === ApiErrorCode.ExistingPasscodeIncorrect) {
            showExistingPasscodeIncorrectModal()
          } else {
            navigateToErrorPage(error)
          }
        },
      },
    )
  }

  const handlePasscodeConfirmationBackButtonClick = () => {
    setCurrentScreen(ChangePasscodeScreen.PasscodeCreation)
  }

  const handlePasscodeNotMatchedConfirmation = () => {
    setCurrentScreen(ChangePasscodeScreen.PasscodeCreation)
  }

  const handleExistingPasscodeIncorrectConfirmation = () => {
    setCurrentScreen(ChangePasscodeScreen.ExistingPasscode)
  }

  const goToSettings = () => {
    history.push(Url.Settings)
  }

  switch (currentScreen) {
    case ChangePasscodeScreen.ExistingPasscode:
      return (
        <ExistingPasscodeScreen
          onPasscodeConfirm={handleExistingPasscodeChange}
          onBackButtonClick={goToSettings}
          onCloseButtonClick={goToSettings}
        />
      )
    case ChangePasscodeScreen.PasscodeCreation:
      return (
        <PasscodeCreationScreen
          onPasscodeConfirm={handleNewPasscodeChange}
          onBackButtonClick={handlePasscodeCreationBackButtonClick}
          onCloseButtonClick={goToSettings}
        />
      )
    case ChangePasscodeScreen.PasscodeConfirmation:
      return (
        <>
          <PasscodeConfirmationScreen
            onPasscodeConfirm={handleNewPasscodeConfirmed}
            onBackButtonClick={handlePasscodeConfirmationBackButtonClick}
            onCloseButtonClick={goToSettings}
          />
          <PasscodesNotMatchModal
            {...passcodeNotMatchModalProps}
            onConfirm={handlePasscodeNotMatchedConfirmation}
          />
          <ExistingPasscodeIncorrectModal
            {...existingPasscodeIncorrectModalProps}
            onConfirm={handleExistingPasscodeIncorrectConfirmation}
          />
          {isLoading && <FullPageLoader />}
        </>
      )
    case ChangePasscodeScreen.SuccessScreen:
      return <SuccessScreen />
    default:
      throw new Error(
        `Passcode screen ${currentScreen} not reachable. It needs to be handled.`,
      )
  }
}
