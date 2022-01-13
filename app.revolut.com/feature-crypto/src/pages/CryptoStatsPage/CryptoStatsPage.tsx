import { VFC } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout, Header, TextWidget, Box } from '@revolut/ui-kit'

import {
  getCryptoDetailsUrl,
  browser,
  CryptoDetailsSourceOption,
} from '@revolut/rwa-core-utils'

type UrlParams = {
  cryptoCode: string
}

type UrlQuery = {
  source: CryptoDetailsSourceOption
}

export const CryptoStatsPage: VFC = () => {
  const { t } = useTranslation('pages.CryptoStats')
  const { cryptoCode } = useParams<UrlParams>()
  const { source } = browser.getQueryParams<UrlQuery>()

  const history = useHistory()

  const onBackButtonClick = () => {
    history.push(getCryptoDetailsUrl(cryptoCode, { tab: 'overview', source }))
  }

  return (
    <Layout>
      <Layout.Main>
        <Header variant="item">
          <Header.BackButton onClick={onBackButtonClick} />
          <Header.Title>{t('header.title')}</Header.Title>
        </Header>
        <Box mt="s-16">
          <TextWidget>
            <TextWidget.Title>{t('marketCap.title')}</TextWidget.Title>
            <TextWidget.Content>{t('marketCap.text', { cryptoCode })}</TextWidget.Content>
          </TextWidget>
        </Box>
        <Box mt="s-32">
          <TextWidget>
            <TextWidget.Title>{t('circulatingSupply.title')}</TextWidget.Title>
            <TextWidget.Content>
              {t('circulatingSupply.text', { cryptoCode })}
            </TextWidget.Content>
          </TextWidget>
        </Box>
        <Box mt="s-32">
          <TextWidget>
            <TextWidget.Title>{t('maxSupply.title')}</TextWidget.Title>
            <TextWidget.Content>{t('maxSupply.text', { cryptoCode })}</TextWidget.Content>
          </TextWidget>
        </Box>
        <Box mt="s-32">
          <TextWidget>
            <TextWidget.Title>{t('24hTradingVolume.title')}</TextWidget.Title>
            <TextWidget.Content>
              {t('24hTradingVolume.text', { cryptoCode })}
            </TextWidget.Content>
          </TextWidget>
        </Box>
        <Box mt="s-32">
          <TextWidget>
            <TextWidget.Title>{t('allTimeHigh.title')}</TextWidget.Title>
            <TextWidget.Content>
              {t('allTimeHigh.text', { cryptoCode })}
            </TextWidget.Content>
          </TextWidget>
        </Box>
      </Layout.Main>
    </Layout>
  )
}
