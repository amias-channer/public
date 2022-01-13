import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from './constants'

export const LoggedOut: FC = () => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)

  const handleSubmitButtonClick = () => {
    history.push(Url.Start)
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Info}
      title={t('title')}
      authLayoutProps={{
        description: t('description'),
        submitButtonText: t('buttonText'),
        handleSubmitButtonClick,
      }}
    />
  )
}
