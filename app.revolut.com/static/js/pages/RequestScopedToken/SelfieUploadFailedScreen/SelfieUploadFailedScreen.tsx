import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { useShowCookiesBannerOnMount } from 'hooks'

import { I18N_NAMESPACE, RequestScopedTokenScreen } from '../constants'
import { RequestScopedTokenScreenProps } from '../types'

export const SelfieUploadFailedScreen: FC<RequestScopedTokenScreenProps> = ({
  onScreenChange,
}) => {
  const { t } = useTranslation([I18N_NAMESPACE, I18nNamespace.Common])
  useShowCookiesBannerOnMount()

  const handleSubmitButtonClick = () =>
    onScreenChange(RequestScopedTokenScreen.TakeSelfie)

  return (
    <StatusLayout
      iconType={StatusIconType.Warning}
      title={t('SelfieUploadFailedScreen.title')}
      authLayoutProps={{
        description: t('SelfieUploadFailedScreen.description'),
        submitButtonText: t('common:retry'),
        submitButtonEnabled: true,
        handleSubmitButtonClick,
      }}
    />
  )
}
