import { VFC, useMemo } from 'react'
import { sortBy, reverse, isEmpty, slice } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useHistory, Link } from 'react-router-dom'
import { Subheader, ContactsWidget, Contact, Action } from '@revolut/ui-kit'

import { Percents, GridSkeleton } from '@revolut/rwa-core-components'
import { getCryptoDetailsUrl, Url } from '@revolut/rwa-core-utils'

import { useCryptoTopMovers } from '../../../hooks'
import { CryptoAvatar } from '../../../components'

const MAX_AMOUNT_TO_SHOW = 12

export const CryptoTopMoversWidget: VFC = () => {
  const { t } = useTranslation('components.CryptoTopMoversWidget')
  const topMovers = useCryptoTopMovers()

  const history = useHistory()

  const onMoverClickHandler = (crytoCode: string) => () => {
    history.push(
      getCryptoDetailsUrl(crytoCode, {
        tab: 'overview',
        source: 'topMoversWidget',
      }),
    )
  }

  const sortedTopMovers = useMemo(
    () =>
      slice(
        reverse(sortBy(topMovers, (crypto) => Math.abs(crypto.growthIndex))),
        0,
        MAX_AMOUNT_TO_SHOW,
      ),
    [topMovers],
  )

  return (
    <>
      <Subheader>
        <Subheader.Title>{t('title.text')}</Subheader.Title>
        {topMovers && topMovers.length > MAX_AMOUNT_TO_SHOW ? (
          <Subheader.Side>
            <Action use={Link} to={Url.CryptoTopMovers}>
              {t('seeAll.button')}
            </Action>
          </Subheader.Side>
        ) : null}
      </Subheader>
      <ContactsWidget limitRows={2}>
        {isEmpty(sortedTopMovers) ? (
          <GridSkeleton />
        ) : (
          sortedTopMovers.map((crypto) => (
            <Contact
              key={crypto.cryptoCode}
              onClick={onMoverClickHandler(crypto.cryptoCode)}
            >
              <CryptoAvatar
                cryptoCode={crypto.cryptoCode}
                avatarProps={{
                  size: 56,
                }}
              />
              <Contact.Title>{crypto.cryptoCode}</Contact.Title>
              <Contact.Description>
                <Percents value={crypto.growthIndex} />
              </Contact.Description>
            </Contact>
          ))
        )}
      </ContactsWidget>
    </>
  )
}
