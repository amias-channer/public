import { VFC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { sortBy, isEmpty } from 'lodash'
import { Header, Layout, Group, ItemSkeleton, Item } from '@revolut/ui-kit'

import { getCryptoDetailsUrl, getHomeUrl } from '@revolut/rwa-core-utils'
import { useLocaleFormatMoney } from '@revolut/rwa-core-i18n'
import { Percents } from '@revolut/rwa-core-components'
import { TopMoversTimeSpan } from '@revolut/rwa-core-types'

import { useCryptoTopMovers, TopMoverType } from '../../hooks'
import { CryptoAvatar } from '../../components'

import { TopMoversFilter, MoversFilter } from './TopMoversFilter'

export const CryptoTopMoversPage: VFC = () => {
  const history = useHistory()
  const { t } = useTranslation('pages.CryptoTopMovers')

  const [moversFilter, setMoversFilter] = useState<MoversFilter>({
    moverType: TopMoverType.All,
    timeSpan: TopMoversTimeSpan.OneDay,
  })

  const onFilterChange = (newFilterValue: MoversFilter) => {
    setMoversFilter(newFilterValue)
  }

  const formatMoney = useLocaleFormatMoney()
  const topMovers = useCryptoTopMovers({
    moverType: moversFilter.moverType,
    timeSpan: moversFilter.timeSpan,
  })

  const sortedTopMovers = sortBy(topMovers, (crypto) => {
    switch (moversFilter.moverType) {
      case TopMoverType.Gainers:
        return crypto.growthIndex
      case TopMoverType.Losers:
        return -crypto.growthIndex
      default:
        return Math.abs(crypto.growthIndex)
    }
  })

  const onBackClick = () => {
    history.push(getHomeUrl({ tab: 'crypto' }))
  }

  const onItemClick = (cryptoCode: string) => () => {
    history.push(
      getCryptoDetailsUrl(cryptoCode, { tab: 'overview', source: 'topMoversPage' }),
    )
  }

  return (
    <Layout>
      <Layout.Main>
        <Header variant="form">
          <Header.BackButton aria-label="Back" onClick={onBackClick} />
          <Header.Title>{t('title.text')}</Header.Title>
          <Header.Description>{t('description.text')}</Header.Description>
          <Header.Bar>
            <TopMoversFilter filter={moversFilter} onChange={onFilterChange} />
          </Header.Bar>
        </Header>
        <Group>
          {isEmpty(sortedTopMovers) ? (
            <>
              <ItemSkeleton />
              <ItemSkeleton />
              <ItemSkeleton />
            </>
          ) : (
            sortedTopMovers.map((mover) => (
              <Item
                key={mover.cryptoCode}
                use="button"
                onClick={onItemClick(mover.cryptoCode)}
              >
                <Item.Avatar>
                  <CryptoAvatar cryptoCode={mover.cryptoCode} />
                </Item.Avatar>
                <Item.Content>
                  <Item.Title>{mover.name}</Item.Title>
                  <Item.Description>{mover.cryptoCode}</Item.Description>
                </Item.Content>
                <Item.Side>
                  <Item.Value>
                    {formatMoney(
                      mover.currentPriceInTargetCurrency.amount,
                      mover.currentPriceInTargetCurrency.currency,
                    )}
                  </Item.Value>
                  <Item.Value variant="secondary">
                    <Percents value={mover.growthIndex} />
                  </Item.Value>
                </Item.Side>
              </Item>
            ))
          )}
        </Group>
      </Layout.Main>
    </Layout>
  )
}
