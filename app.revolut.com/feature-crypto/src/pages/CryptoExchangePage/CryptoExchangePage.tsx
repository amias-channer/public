import { FC, useContext, useCallback, useState } from 'react'
import { Layout, Widget } from '@revolut/ui-kit'
import { useParams } from 'react-router-dom'

import { CryptoFxLineChart } from '../../components'
import { CryptoContext } from '../../providers'
import {
  CryptoExchangeUrlParams,
  CryptoExchangeMethod,
  CurrentExchangeRate,
} from '../../types'

import { CryptoExchange } from './CryptoExchange'

export const CryptoExchangePage: FC = () => {
  const { cryptoCode, exchangeMethod } = useParams<CryptoExchangeUrlParams>()
  const { targetCurrency } = useContext(CryptoContext)
  const [exchangeRate, setExchangeRate] = useState<CurrentExchangeRate>()

  const updateExchangeRate = useCallback((newExchangeRate: CurrentExchangeRate) => {
    setExchangeRate(newExchangeRate)
  }, [])

  return (
    <Layout side="wide">
      <CryptoExchange onExchangeRateUpdate={updateExchangeRate} />
      <Layout.Side>
        <Widget
          __css={{
            width: '100%',
            height: '100%',
            borderRadius: 24,
            boxShadow: `0px 2px 4px rgb(25 28 31 / 5%), 0px 3px 16px rgb(25 28 31 / 10%)`,
          }}
        >
          <CryptoFxLineChart
            baseCurrency={cryptoCode}
            targetCurrency={targetCurrency}
            exchangeRate={exchangeRate}
            reversed={exchangeMethod === CryptoExchangeMethod.Buy}
          />
        </Widget>
      </Layout.Side>
    </Layout>
  )
}
