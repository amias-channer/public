import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../constants'
import { ScreenDescription } from './ScreenDescription'

export const WrongDeviceScreen: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <StatusLayout
      iconType={StatusIconType.Info}
      iconColor="warning"
      title={t('WrongDeviceScreen.title')}
      authLayoutProps={{
        description: <ScreenDescription />,
      }}
    />
  )
}
