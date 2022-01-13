import { useEffect, VFC } from 'react'
import { Layout } from '@revolut/ui-kit'
import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'

import { useParams, useHistory } from 'react-router-dom'
import {
  TransactionDetails,
  DetailsScreenSource,
} from '@revolut/rwa-feature-transactions'
import {
  browser,
  getCryptoDetailsUrl,
  CryptoDetailsSourceOption,
} from '@revolut/rwa-core-utils'

type UrlParams = {
  cryptoCode: string
  transactionId: string
}

type QueryParams = {
  legId?: string
  source: CryptoDetailsSourceOption
}

export const CryptoTransactionDetails: VFC = () => {
  const { transactionId, cryptoCode } = useParams<UrlParams>()
  const { legId, source } = browser.getQueryParams<QueryParams>()
  const history = useHistory()

  const onBackButtonClick = () => {
    history.push(getCryptoDetailsUrl(cryptoCode, { tab: 'transactions', source }))
  }

  useEffect(() => {
    trackEvent(CryptoTrackingEvent.historicalTransactionsTab)
  }, [])

  return (
    <Layout>
      <Layout.Main>
        <TransactionDetails
          transactionId={transactionId}
          transactionLegId={legId}
          source={DetailsScreenSource.CryptoTransactionsList}
          onBackButtonClick={onBackButtonClick}
        />
      </Layout.Main>
    </Layout>
  )
}
