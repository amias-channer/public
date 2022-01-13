import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { SETTINGS_I18N_NAMESPACE } from '../../constants'

export const SuccessScreen: FC = () => {
  const { t } = useTranslation([SETTINGS_I18N_NAMESPACE, 'common'])
  const history = useHistory()

  const handleButtonClick = () => {
    history.push(Url.PersonalDetails)
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Success}
      title={t('ChangePhoneNumber.SuccessScreen.title')}
      authLayoutProps={{
        submitButtonText: t('common:done'),
        handleSubmitButtonClick: handleButtonClick,
      }}
    />
  )
}
