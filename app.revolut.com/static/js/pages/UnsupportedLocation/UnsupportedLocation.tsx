import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AuthLayout,
  H2,
  Illustration,
  IllustrationAssetId,
  Paragraph,
  TextBox,
} from '@revolut/rwa-core-components'
import { getConfigValue, ConfigKey } from '@revolut/rwa-core-config'
import { browser } from '@revolut/rwa-core-utils'

export const UnsupportedLocation: FC = () => {
  const { t } = useTranslation('pages.UnsupportedLocation')

  const handleSubmitButtonClick = () => {
    browser.navigateTo(getConfigValue(ConfigKey.RevolutWebsiteUrl))
  }

  return (
    <AuthLayout
      centerContent
      illustration={<Illustration assetId={IllustrationAssetId.UnsupportedCountry} />}
      submitButtonText={t('buttonText')}
      submitButtonEnabled
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <H2>{t('title')}</H2>
      <Paragraph>
        <TextBox>{t('text')}</TextBox>
      </Paragraph>
    </AuthLayout>
  )
}
