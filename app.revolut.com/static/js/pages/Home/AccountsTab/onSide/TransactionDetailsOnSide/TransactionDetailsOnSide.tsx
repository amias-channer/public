import qs from 'qs'
import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Side } from '@revolut/ui-kit'

import { browser, getHomeUrl } from '@revolut/rwa-core-utils'
import {
  TransactionDetails,
  DetailsScreenSource,
} from '@revolut/rwa-feature-transactions'

type UrlQueryParams = {
  accountId?: string
  transactionId?: string
  transactionLegId?: string
}

export const TransactionDetailsOnSide: FC = () => {
  const history = useHistory()

  const { transactionId, transactionLegId, accountId } = qs.parse(
    browser.getSearch(),
  ) as UrlQueryParams

  const onSideExit = () => {
    history.push(
      getHomeUrl({
        tab: 'accounts',
        queryParams: { accountId },
      }),
    )
  }

  const onTransactionLinkClick = (id: string) => {
    history.push(
      getHomeUrl({
        tab: 'accounts',
        queryParams: {
          transactionId: id,
        },
      }),
    )
  }

  if (!transactionId) {
    return null
  }

  return (
    <Side isOpen={Boolean(transactionId)} onExit={onSideExit}>
      <TransactionDetails
        transactionId={transactionId}
        transactionLegId={transactionLegId}
        source={DetailsScreenSource.HomePage}
        onTransactionLinkClick={onTransactionLinkClick}
      />
    </Side>
  )
}
