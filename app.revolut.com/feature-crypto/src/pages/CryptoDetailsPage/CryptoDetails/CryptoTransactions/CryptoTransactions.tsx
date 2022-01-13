import { VFC } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box } from '@revolut/ui-kit'

import {
  GroupedLatestTransactions,
  TransactionsGroupSkeleton,
  NoTransactionsFound,
} from '@revolut/rwa-feature-transactions'
import { useQueryWallet } from '@revolut/rwa-core-api'
import {
  browser,
  checkRequired,
  CryptoDetailsSourceOption,
  getCryptoTransactionDetailsUrl,
  findCurrentActivePocketByCurrency,
} from '@revolut/rwa-core-utils'
import { TransactionDto } from '@revolut/rwa-core-types'

export const TRANSACTIONS_LOAD_TEST_ID = 'transactions-loading-test-id'
export const GROUPED_TRANSACTIONS_TEST_ID = 'grouped-transactions-test-id'

type UrlParams = {
  cryptoCode: string
}

type UrlQuery = {
  source: CryptoDetailsSourceOption
}

export const CryptoTransactions: VFC = () => {
  const { cryptoCode } = useParams<UrlParams>()
  const { source } = browser.getQueryParams<UrlQuery>()
  const { data: walletData, status: walletStatus } = useQueryWallet()
  const history = useHistory()

  if (walletStatus === 'loading') {
    return (
      <Box data-testid={TRANSACTIONS_LOAD_TEST_ID}>
        <TransactionsGroupSkeleton />
      </Box>
    )
  }

  const wallet = checkRequired(walletData, 'wallet should not be empty')
  const cryptoPocket = findCurrentActivePocketByCurrency(wallet.pockets, cryptoCode)

  if (!cryptoPocket) {
    return <NoTransactionsFound />
  }

  const onTransactionClick = (transaction: TransactionDto) => {
    history.push(
      getCryptoTransactionDetailsUrl(
        cryptoCode,
        transaction.id,
        source,
        transaction.legId,
      ),
    )
  }

  return (
    <Box data-testid={GROUPED_TRANSACTIONS_TEST_ID}>
      <GroupedLatestTransactions
        pocketId={cryptoPocket.id}
        onTransactionItemClick={onTransactionClick}
      />
    </Box>
  )
}
