import { VFC, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { debounce } from 'lodash'
import { Layout, Header, Search, Box } from '@revolut/ui-kit'
import { useTranslation } from 'react-i18next'

import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'
import { getHomeUrl, getCryptoDetailsUrl } from '@revolut/rwa-core-utils'

import { CryptoHoldingsList } from '../../components'

const DEBOUNCE_TIMEOUT = 150

export const CryptoHoldingsPage: VFC = () => {
  const { t } = useTranslation('pages.CryptoHoldingsPage')

  const [searchValue, setSearchValue] = useState<string>()

  const history = useHistory()

  const onSearch = debounce((newValue) => {
    setSearchValue(newValue)
  }, DEBOUNCE_TIMEOUT)

  const onBackClick = () => {
    history.push(getHomeUrl({ tab: 'crypto' }))
  }

  const onItemClick = (cryptoCode: string) => {
    trackEvent(CryptoTrackingEvent.assetHoldingsEntryPointClicked, {
      TICKER: cryptoCode,
    })
    history.push(
      getCryptoDetailsUrl(cryptoCode, { tab: 'overview', source: 'holdingsPage' }),
    )
  }

  useEffect(() => {
    trackEvent(CryptoTrackingEvent.investListOpened)
  }, [])

  return (
    <Layout>
      <Layout.Main>
        <Header variant="item">
          <Header.BackButton onClick={onBackClick} />
          <Header.Title>{t('title.text')}</Header.Title>
        </Header>
        <Search placeholder={t('search.placeholder')} onChange={onSearch} />
        <Box mt="s-24">
          <CryptoHoldingsList filterValue={searchValue} onItemClick={onItemClick} />
        </Box>
      </Layout.Main>
    </Layout>
  )
}
