import { FC } from 'react'
import { useHistory } from 'react-router-dom'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { useSignUpTranslation } from '../hooks'

export const SuccessScreen: FC = () => {
  const t = useSignUpTranslation()
  const history = useHistory()

  const handleButtonClick = () => {
    history.push(Url.SignUpTopUp)
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Success}
      title={t('SuccessScreen.title')}
      authLayoutProps={{
        description: t('SuccessScreen.description'),
        submitButtonText: t('SuccessScreen.buttonText'),
        handleSubmitButtonClick: handleButtonClick,
      }}
    />
  )
}
