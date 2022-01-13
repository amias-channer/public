import { FC } from 'react'
import qs from 'qs'
import { Side } from '@revolut/ui-kit'
import { useHistory, useParams } from 'react-router-dom'
import {
  getTransactionDetailsUrl,
  getTransactionsListUrl,
  browser,
} from '@revolut/rwa-core-utils'

import { TransactionDetails, DetailsScreenSource } from '../../../components'

type UrlParams = {
  transactionId: string
}

type QueryParams = {
  legId?: string
  accountId?: string
}

export const TransactionDetailsOnSide: FC = () => {
  const { transactionId } = useParams<UrlParams>()
  const history = useHistory()

  const { legId, accountId } = qs.parse(browser.getSearch()) as QueryParams

  const onSideExit = () => {
    history.push(getTransactionsListUrl(accountId))
  }

  const onTransactionLinkClick = (id: string) => {
    history.push(getTransactionDetailsUrl(id))
  }

  return (
    <Side isOpen={Boolean(transactionId)} onExit={onSideExit}>
      <TransactionDetails
        transactionId={transactionId}
        transactionLegId={legId}
        source={DetailsScreenSource.AllTransactions}
        onTransactionLinkClick={onTransactionLinkClick}
      />
    </Side>
  )
}
