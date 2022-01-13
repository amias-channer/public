import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { OtpCodeLayout } from '@revolut/rwa-core-components'
import { checkRequired } from '@revolut/rwa-core-utils'

import { SETTINGS_I18N_NAMESPACE } from '../../constants'
import { ChangePhoneNumberContext } from '../ChangePhoneNumberProvider'
import { useSubmitNewPhoneOtp } from '../hooks'
import { ChangePhoneNumberScreenComponent } from '../types'

export const NewPhoneNumberOtpScreen: ChangePhoneNumberScreenComponent = ({
  onBackButtonClick,
  onCloseButtonClick,
  onConfirm,
}) => {
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)
  const { submitNewPhoneOtp } = useSubmitNewPhoneOtp()
  const [errorMessage, setErrorMessage] = useState('')
  const { newPhone } = useContext(ChangePhoneNumberContext)

  const handleSubmitError = () => {
    setErrorMessage(t('ChangePhoneNumber.otp.error'))
  }

  const handleOtpCodeSubmit = (value: string) => {
    submitNewPhoneOtp(
      {
        phone: checkRequired(newPhone, 'new phone number is required'),
        otpCode: value,
      },
      {
        onSuccess: onConfirm,
        onError: handleSubmitError,
      },
    )
  }

  const handleClearErrorMessage = () => {
    setErrorMessage('')
  }

  return (
    <OtpCodeLayout
      title={t('ChangePhoneNumber.otp.title')}
      description={t('ChangePhoneNumber.otp.description', {
        phoneNumber: newPhone,
      })}
      errorMessage={errorMessage}
      phone={newPhone}
      onBackButtonClick={onBackButtonClick}
      onCloseButtonClick={onCloseButtonClick}
      onErrorMessageClear={handleClearErrorMessage}
      onSubmit={handleOtpCodeSubmit}
    />
  )
}
