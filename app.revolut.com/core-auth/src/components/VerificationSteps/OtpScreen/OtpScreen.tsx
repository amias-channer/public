import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { FullPageLoader, OtpCodeLayout } from '@revolut/rwa-core-components'

import { useAuthContext } from '../../../providers'
import { I18N_NAMESPACE } from '../constants'

type OtpScreenProps = {
  shouldShowError: boolean
  onErrorMessageClear: VoidFunction
  onBackButtonClick: VoidFunction
  onCodeSubmit: (code: string) => void
}

export const OtpScreen: FC<OtpScreenProps> = ({
  shouldShowError,
  onErrorMessageClear,
  onBackButtonClick,
  onCodeSubmit,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { user } = useAuthContext()

  if (!user) {
    return <FullPageLoader />
  }

  return (
    <OtpCodeLayout
      title={t('OtpScreen.title')}
      description={t('OtpScreen.description', {
        phoneNumber: user.phone,
      })}
      errorMessage={shouldShowError ? t('OtpScreen.error') : undefined}
      phone={user.phone}
      onErrorMessageClear={onErrorMessageClear}
      onBackButtonClick={onBackButtonClick}
      onSubmit={onCodeSubmit}
    />
  )
}
