import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Illustration,
  IllustrationAssetId,
  StatusIconType,
  StatusLayout,
} from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../constants'
import { ScreenDescription } from './ScreenDescription'

export const SuccessScreen: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)

  return (
    <StatusLayout
      iconType={StatusIconType.Success}
      title={t('SuccessScreen.title')}
      authLayoutProps={{
        description: <ScreenDescription />,
        illustration: <Illustration assetId={IllustrationAssetId.DownloadTheApp} />,
      }}
    />
  )
}
