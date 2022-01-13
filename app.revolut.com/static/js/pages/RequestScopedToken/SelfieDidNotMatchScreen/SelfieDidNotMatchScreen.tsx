import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Media } from '@revolut/ui-kit'

import { StatusIconType, StatusLayout } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

import { useShowCookiesBannerOnMount } from 'hooks'

import { I18N_NAMESPACE, RequestScopedTokenScreen } from '../constants'
import { RequestScopedTokenScreenProps } from '../types'

export const SelfieDidNotMatchScreen: FC<RequestScopedTokenScreenProps> = ({
  onScreenChange,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  useShowCookiesBannerOnMount()

  const handleSubmitButtonClick = () =>
    onScreenChange(RequestScopedTokenScreen.TakeSelfie)

  return (
    <StatusLayout
      iconType={StatusIconType.Warning}
      title={t('SelfieDidNotMatchScreen.title')}
      authLayoutProps={{
        description: t('SelfieDidNotMatchScreen.description'),
        submitButtonText: (
          <Media alignItems="center">
            <Icons.Retry size={IconSize.Small} />
            <Media.Content ml="px10">
              {t('SelfieDidNotMatchScreen.submitButtonText')}
            </Media.Content>
          </Media>
        ),
        submitButtonEnabled: true,
        handleSubmitButtonClick,
      }}
    />
  )
}
