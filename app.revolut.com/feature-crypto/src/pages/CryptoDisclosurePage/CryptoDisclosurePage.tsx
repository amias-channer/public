import { VFC } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import { Layout, Header, TextWidget, Box } from '@revolut/ui-kit'

import { getHomeUrl } from '@revolut/rwa-core-utils'
import { Link } from '@revolut/rwa-core-components'
import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'

export const CryptoDisclosurePage: VFC = () => {
  const { t } = useTranslation('pages.CryptoDisclosure')

  const history = useHistory()

  const cryptoTermsLink = getConfigValue(ConfigKey.CryptoTermsUrl)

  const onBackButtonClick = () => {
    history.push(getHomeUrl({ tab: 'crypto' }))
  }

  return (
    <Layout>
      <Layout.Main>
        <Header variant="item">
          <Header.BackButton onClick={onBackButtonClick} />
          <Header.Title>{t('header.text')}</Header.Title>
          <Header.Description>
            <Trans
              t={t}
              i18nKey="header.descriptionText"
              components={{
                termsAndCondsLink: <Link href={cryptoTermsLink} isNewTab />,
              }}
            />
          </Header.Description>
        </Header>
        <Box mt="s-16">
          <TextWidget>
            <TextWidget.Title>{t('cryptoStats.title')}</TextWidget.Title>
            <TextWidget.Content>{t('cryptoStats.text')}</TextWidget.Content>
          </TextWidget>
        </Box>
        <Box mt="s-32">
          <TextWidget>
            <TextWidget.Title>{t('cryptoBiographies.title')}</TextWidget.Title>
            <TextWidget.Content>{t('cryptoBiographies.text')}</TextWidget.Content>
          </TextWidget>
        </Box>
        <Box mt="s-32">
          <TextWidget>
            <TextWidget.Title>{t('general.title')}</TextWidget.Title>
            <TextWidget.Content>{t('general.text')}</TextWidget.Content>
          </TextWidget>
        </Box>
      </Layout.Main>
    </Layout>
  )
}
