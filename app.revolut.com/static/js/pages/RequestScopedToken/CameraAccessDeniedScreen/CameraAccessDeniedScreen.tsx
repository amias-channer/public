import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'

import { useShowCookiesBannerOnMount, useAuthorizeUserWithoutSelfie } from 'hooks'

import { I18N_NAMESPACE } from '../constants'

export const CameraAccessDeniedScreen: FC = () => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const authorizeUserWithoutSelfie = useAuthorizeUserWithoutSelfie()

  useShowCookiesBannerOnMount()

  return (
    <StatusLayout
      iconType={StatusIconType.Error}
      title={t('CameraAccessDeniedScreen.title')}
      authLayoutProps={{
        description: t('CameraAccessDeniedScreen.description'),
        submitButtonText: t('CameraAccessDeniedScreen.submitButtonText'),
        submitButtonEnabled: true,
        handleSubmitButtonClick: authorizeUserWithoutSelfie,
      }}
    />
  )
}
