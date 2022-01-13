import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@revolut/ui-kit'

import { I18N_NAMESPACE } from '../constants'

type ScreenHeaderProps = {
  title?: string
  onGoBack?: VoidFunction
}

export const ScreenHeader: FC<ScreenHeaderProps> = ({ title, onGoBack }) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <Header variant="form">
      <Header.BackButton onClick={onGoBack} />

      <Header.Title>
        {title ?? t('facelift.TopUpViaCardScreen.ScreenHeader.title')}
      </Header.Title>
    </Header>
  )
}
