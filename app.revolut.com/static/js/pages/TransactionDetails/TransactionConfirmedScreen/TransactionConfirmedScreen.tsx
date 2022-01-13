import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../constants'

type Props = {
  cardLast4: string
}

export const TransactionConfirmedScreen: FC<Props> = ({ cardLast4 }) => {
  const { t } = useTranslation([I18N_NAMESPACE, 'common'])
  const history = useHistory()

  const handleButtonClick = () => {
    history.push(Url.TransactionsList)
  }

  return (
    <StatusLayout
      iconType={StatusIconType.Success}
      title={t('TransactionConfirmedScreen.title')}
      authLayoutProps={{
        description: t('TransactionConfirmedScreen.description', {
          cardLast4,
        }),
        submitButtonText: t('common:done'),
        handleSubmitButtonClick: handleButtonClick,
      }}
    />
  )
}
