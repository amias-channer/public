import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@revolut/ui-kit'

import { I18N_NAMESPACE } from '../constants'

type ScreenHeaderProps = {
  onGoBack?: VoidFunction
}

export const ScreenHeader: FC<ScreenHeaderProps> = ({ onGoBack }) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <Header variant="form">
      <Header.BackButton onClick={onGoBack} />

      <Header.Title>{t('TopUpViaBankTransferScreen.title')}</Header.Title>

      <Header.Description>
        {t('TopUpViaBankTransferScreen.description')}
      </Header.Description>
    </Header>
  )
}
