import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import {
  AuthLayout,
  H2,
  Illustration,
  IllustrationAssetId,
  Paragraph,
  TextBox,
} from '@revolut/rwa-core-components'
import { ConfigKey, FeatureKey, getConfigValue } from '@revolut/rwa-core-config'
import { UserKycStatus } from '@revolut/rwa-core-types'
import { browser, Url } from '@revolut/rwa-core-utils'

import { useFeaturesConfig } from 'hooks'

import { I18N_NAMESPACE } from '../constants'

const getKycStateI18nKey = (state: UserKycStatus) => {
  switch (state) {
    case UserKycStatus.None:
      return 'kycNotStarted'
    case UserKycStatus.Pending:
      return 'kycPending'
    default:
      return 'kycFailed'
  }
}

const getKycStateIllustrationId = (state: UserKycStatus) => {
  switch (state) {
    case UserKycStatus.None:
    case UserKycStatus.Pending:
      return IllustrationAssetId.KycNotStartedOrPending
    default:
      return IllustrationAssetId.KycFailed
  }
}

const DEFAULT_KYC_STATE = UserKycStatus.None

export const KycStateScreen: FC = () => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)
  const { isFeatureActive } = useFeaturesConfig()

  const handleSubmitButtonClick = () => {
    if (isFeatureActive(FeatureKey.AllowNewDownloadTheAppFlow)) {
      history.push(Url.DownloadTheApp)
    } else {
      browser.navigateTo(getConfigValue(ConfigKey.RevolutWebsiteGetTheAppUrl))
    }
  }

  const kycStateI18nKey = getKycStateI18nKey(DEFAULT_KYC_STATE)
  const illustrationId = getKycStateIllustrationId(DEFAULT_KYC_STATE)

  return (
    <AuthLayout
      centerContent
      illustration={<Illustration assetId={illustrationId} />}
      submitButtonText={t('KycStateScreen.submitButtonText')}
      submitButtonEnabled
      handleSubmitButtonClick={handleSubmitButtonClick}
    >
      <H2>{t(`KycStateScreen.title.${kycStateI18nKey}`)}</H2>
      <Paragraph>
        <TextBox>{t(`KycStateScreen.description.${kycStateI18nKey}`)}</TextBox>
      </Paragraph>
    </AuthLayout>
  )
}
