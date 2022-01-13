import { VFC } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useHistory, Link } from 'react-router-dom'
import { Subheader, ContactsWidget, Contact, Action } from '@revolut/ui-kit'

import { Percents, GridSkeleton } from '@revolut/rwa-core-components'
import { getCryptoDetailsUrl, Url } from '@revolut/rwa-core-utils'

import { usePopularCrypto } from '../../../hooks'
import { CryptoAvatar } from '../../../components'

const MAX_AMOUNT_TO_SHOW = 12

export const PopularCryptoWidget: VFC = () => {
  const { t } = useTranslation('components.PopularCryptoWidget')
  const history = useHistory()

  const popularCrypto = usePopularCrypto()

  const onItemClick = (cryptoCode: string) => () => {
    history.push(
      getCryptoDetailsUrl(cryptoCode, { tab: 'overview', source: 'populaCryptoWidget' }),
    )
  }

  return (
    <>
      <Subheader>
        <Subheader.Title>{t('title.text')}</Subheader.Title>
        {popularCrypto.length > MAX_AMOUNT_TO_SHOW ? (
          <Subheader.Side>
            <Action use={Link} to={Url.CryptoPopularAssets}>
              {t('seeAll.button')}
            </Action>
          </Subheader.Side>
        ) : null}
      </Subheader>
      <ContactsWidget limitRows={2}>
        {isEmpty(popularCrypto) ? (
          <GridSkeleton />
        ) : (
          popularCrypto.map((crypto) => (
            <Contact key={crypto.cryptoCode} onClick={onItemClick(crypto.cryptoCode)}>
              <CryptoAvatar
                cryptoCode={crypto.cryptoCode}
                avatarProps={{
                  size: 56,
                }}
              />
              <Contact.Title>{crypto.cryptoCode}</Contact.Title>
              {crypto.volatility ? (
                <Contact.Description>
                  <Percents value={crypto.volatility} />
                </Contact.Description>
              ) : null}
            </Contact>
          ))
        )}
      </ContactsWidget>
    </>
  )
}
