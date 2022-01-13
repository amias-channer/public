import { FC, useContext } from 'react'
import { Layout, Widget } from '@revolut/ui-kit'
import { useParams } from 'react-router-dom'

import { CryptoFxLineChart } from '../../components'
import { CryptoContext } from '../../providers'
import { CryptoDetails } from './CryptoDetails'

type UrlParams = {
  cryptoCode: string
}

export const CryptoDetailsPage: FC = () => {
  const { cryptoCode } = useParams<UrlParams>()
  const { targetCurrency } = useContext(CryptoContext)

  return (
    <Layout side="wide">
      <CryptoDetails />
      <Layout.Side>
        <Widget
          __css={{
            width: '100%',
            height: '100%',
            borderRadius: 24,
            boxShadow: `0px 2px 4px rgb(25 28 31 / 5%), 0px 3px 16px rgb(25 28 31 / 10%)`,
          }}
        >
          <CryptoFxLineChart baseCurrency={cryptoCode} targetCurrency={targetCurrency} />
        </Widget>
      </Layout.Side>
    </Layout>
  )
}
