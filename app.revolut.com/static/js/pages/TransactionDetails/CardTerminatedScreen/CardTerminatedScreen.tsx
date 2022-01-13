import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../constants'

export const CardTerminatedScreen: FC = () => {
  const { t } = useTranslation([I18N_NAMESPACE, 'common'])
  const history = useHistory()

  const handleButtonClick = () => {
    history.push(Url.CardOrdering)
  }

  const handleSecondaryButtonClick = () => {
    history.push(Url.TransactionsList)
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Success}
      title={t('CardTerminatedScreen.title')}
      authLayoutProps={{
        description: t('CardTerminatedScreen.description'),
        submitButtonText: t('CardTerminatedScreen.orderCardButton'),
        secondaryButtonText: t('CardTerminatedScreen.laterButton'),
        handleSubmitButtonClick: handleButtonClick,
        handleSecondaryButtonClick,
      }}
    />
  )
}
