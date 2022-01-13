import { useContext, VFC } from 'react'
import { Layout } from '@revolut/ui-kit'
import { Redirect, useParams } from 'react-router-dom'

import { CryptoExchangeContext } from '../../providers'
import { CryptoExchangeUrlParams } from '../../types'
import { getCryptoExchangeMethodUrl } from '../../utils'
import { CryptoExchangeConfirmation } from './CryptoExchangeConfirmation'

export const CryptoExchangeConfirmationPage: VFC = () => {
  const { cryptoCode, exchangeMethod } = useParams<CryptoExchangeUrlParams>()

  const { cryptoExchangeParams } = useContext(CryptoExchangeContext)

  if (!cryptoExchangeParams) {
    return <Redirect to={getCryptoExchangeMethodUrl(cryptoCode, exchangeMethod)} />
  }

  return (
    <Layout>
      <CryptoExchangeConfirmation cryptoExchangeParams={cryptoExchangeParams} />
    </Layout>
  )
}
