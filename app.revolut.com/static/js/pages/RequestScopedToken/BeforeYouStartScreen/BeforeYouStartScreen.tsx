import { FC, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import {
  AuthLayout,
  Illustration,
  IllustrationAssetId,
  PageSectionTitle,
  Spacer,
} from '@revolut/rwa-core-components'
import { browser, I18nNamespace, Url } from '@revolut/rwa-core-utils'

import { useShowCookiesBannerOnMount } from 'hooks'

import { I18N_NAMESPACE, VIDEO_CONSTRAINTS, RequestScopedTokenScreen } from '../constants'
import { RequestScopedTokenScreenProps } from '../types'
import { Hints } from './Hints'

export const BeforeYouStartScreen: FC<RequestScopedTokenScreenProps> = ({
  onScreenChange,
}) => {
  const { t } = useTranslation([I18N_NAMESPACE, I18nNamespace.Common])
  const [canSubmit, setCanSubmit] = useState(false)
  const history = useHistory()

  useShowCookiesBannerOnMount()

  const goToCameraAccessDeniedScreen = useCallback(() => {
    onScreenChange(RequestScopedTokenScreen.CameraAccessDeniedScreen)
  }, [onScreenChange])

  useEffect(() => {
    if (!browser.canRequestUserMedia()) {
      goToCameraAccessDeniedScreen()

      return
    }

    browser.requestUserMedia(
      { video: VIDEO_CONSTRAINTS },
      () => {
        setCanSubmit(true)
      },
      () => {
        goToCameraAccessDeniedScreen()
      },
    )
  }, [goToCameraAccessDeniedScreen])

  const handleCloseButtonClick = () => {
    history.push(Url.Start)
  }

  const handleSubmitButtonClick = () => {
    onScreenChange(RequestScopedTokenScreen.TakeSelfie)
  }

  return (
    <AuthLayout
      title={t('BeforeYouStartScreen.title')}
      description={t('BeforeYouStartScreen.description')}
      illustration={<Illustration assetId={IllustrationAssetId.Camera} />}
      submitButtonText={t('common:continue')}
      submitButtonEnabled={canSubmit}
      handleCloseButtonClick={handleCloseButtonClick}
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <Spacer h="px16" />
      <PageSectionTitle>{t('BeforeYouStartScreen.hintsSection.title')}</PageSectionTitle>
      <Hints />
    </AuthLayout>
  )
}
