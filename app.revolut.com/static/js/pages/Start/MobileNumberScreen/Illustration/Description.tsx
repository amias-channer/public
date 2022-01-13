import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { TextBox } from '@revolut/ui-kit'

import { ConfigKey, FeatureKey, getConfigValue } from '@revolut/rwa-core-config'
import { browser, Url } from '@revolut/rwa-core-utils'

import { useFeaturesConfig } from 'hooks'

import { I18N_NAMESPACE } from '../../constants'
import { ButtonStyled, DescriptionContainer, DescriptionContent } from './styled'

export const IllustrationDescription: FC = () => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)
  const { isFeatureActive } = useFeaturesConfig()

  const handleGetTheAppClick = () => {
    if (isFeatureActive(FeatureKey.AllowNewDownloadTheAppFlow)) {
      history.push(Url.DownloadTheApp)
    } else {
      browser.navigateTo(getConfigValue(ConfigKey.RevolutWebsiteGetTheAppUrl))
    }
  }

  return (
    <DescriptionContainer>
      <DescriptionContent>
        <TextBox color="getTheAppIllustrationTextColor" mr="px12">
          {t('MobileNumberScreen.illustration.title')}
        </TextBox>
        <ButtonStyled onClick={handleGetTheAppClick}>
          {t('MobileNumberScreen.illustration.button')}
        </ButtonStyled>
      </DescriptionContent>
    </DescriptionContainer>
  )
}
