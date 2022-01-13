import { VFC } from 'react'
import { Text } from '@revolut/ui-kit'
import { useTranslation, Trans } from 'react-i18next'

import { Link } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { CryptoHomeProductWidget } from './CryptoHomeProductWidget'
import { CryptoTopMoversWidget } from './CryptoTopMoversWidget'
import { PopularCryptoWidget } from './PopularCryptoWidget'

export const CryptoHomePage: VFC = () => {
  const { t } = useTranslation('components.CryptoHomeProductWidget')
  return (
    <>
      <CryptoHomeProductWidget />
      <CryptoTopMoversWidget />
      <PopularCryptoWidget />
      <Text mt="s-32" textAlign="center" variant="caption" color="grey-tone-50">
        <Trans
          t={t}
          i18nKey="cryptoDisclosure.text"
          components={{
            cryptoDisclosureLink: <Link to={Url.CryptoDisclosure} />,
          }}
        />
      </Text>
    </>
  )
}
