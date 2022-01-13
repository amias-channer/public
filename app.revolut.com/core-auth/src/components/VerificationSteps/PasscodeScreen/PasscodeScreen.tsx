import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { PasscodeLayout } from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../constants'

type PasscodeScreenProps = {
  shouldShowError: boolean
  onErrorMessageClear: VoidFunction
  onBackButtonClick: VoidFunction
  onPasscodeSubmit: (passcode: string) => void
}

export const PasscodeScreen: FC<PasscodeScreenProps> = ({
  shouldShowError,
  onErrorMessageClear,
  onBackButtonClick,
  onPasscodeSubmit,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <PasscodeLayout
      title={t('PasscodeScreen.title')}
      description={t('PasscodeScreen.description')}
      errorMessage={shouldShowError ? t('PasscodeScreen.error') : ''}
      onErrorMessageClear={onErrorMessageClear}
      onBackButtonClick={onBackButtonClick}
      onPasscodeConfirm={onPasscodeSubmit}
    />
  )
}
