import { VFC } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { Header, Layout, Group, ItemSkeleton, Item } from '@revolut/ui-kit'

import { getCryptoDetailsUrl, getHomeUrl } from '@revolut/rwa-core-utils'
import { useLocaleFormatMoney } from '@revolut/rwa-core-i18n'
import { Percents } from '@revolut/rwa-core-components'

import { usePopularCrypto } from '../../hooks'
import { CryptoAvatar } from '../../components'

export const CryptoPopularAssetsPage: VFC = () => {
  const history = useHistory()
  const formatMoney = useLocaleFormatMoney()
  const { t } = useTranslation('pages.CryptoPopularAssets')

  const popularCrypto = usePopularCrypto()

  const onBackClick = () => {
    history.push(getHomeUrl({ tab: 'crypto' }))
  }

  const onItemClick = (cryptoCode: string) => () => {
    history.push(
      getCryptoDetailsUrl(cryptoCode, { tab: 'overview', source: 'populaCryptoPage' }),
    )
  }

  return (
    <Layout>
      <Layout.Main>
        <Header variant="form">
          <Header.BackButton aria-label="Back" onClick={onBackClick} />
          <Header.Title>{t('title.text')}</Header.Title>
          <Header.Description>{t('description.text')}</Header.Description>
        </Header>
        <Group>
          {isEmpty(popularCrypto) ? (
            <>
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
            </>
          ) : (
            popularCrypto.map((asset) => (
              <Item
                key={asset.cryptoCode}
                use="button"
                onClick={onItemClick(asset.cryptoCode)}
              >
                <Item.Avatar>
                  <CryptoAvatar cryptoCode={asset.cryptoCode} />
                </Item.Avatar>
                <Item.Content>
                  <Item.Title>{asset.name}</Item.Title>
                  <Item.Description>{asset.cryptoCode}</Item.Description>
                </Item.Content>
                <Item.Side>
                  <Item.Value>
                    {formatMoney(
                      asset.currentPriceInTargetCurrency.amount,
                      asset.currentPriceInTargetCurrency.currency,
                    )}
                  </Item.Value>
                  {asset.volatility ? (
                    <Item.Value variant="secondary">
                      <Percents value={asset.volatility} />
                    </Item.Value>
                  ) : null}
                </Item.Side>
              </Item>
            ))
          )}
        </Group>
      </Layout.Main>
    </Layout>
  )
}
