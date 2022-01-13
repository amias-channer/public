import { useTranslation } from 'react-i18next'

import { PasscodeLayout, PasscodeLayoutProps } from '@revolut/rwa-core-components'

import { SETTINGS_I18N_NAMESPACE } from '../../constants'

export const ExistingPasscodeScreen: PasscodeLayoutProps = (props) => {
  const { t } = useTranslation(SETTINGS_I18N_NAMESPACE)

  return (
    <PasscodeLayout {...props} title={t('ChangePasscode.ExistingPasscodeScreen.title')} />
  )
}
