import { isEmpty, flow, sortBy, reverse } from 'lodash/fp'
import { FC } from 'react'
import { Group, ItemSkeleton, ErrorWidget } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'
import { getAsset, AssetProject } from '@revolut/rwa-core-utils'

import { useQueryTransactions } from '../../hooks'
import { TransactionCard } from '../TransactionCard'

import { Header } from './Header'

export const DEFAULT_AMOUNT_TO_SHOW = 5

export const TRANSACTIONS_LOADING_LABEL = 'latest-transactions-loading'
export const LATEST_TRANSACTIONS_BLOCK_LABEL = 'latest-transactions-block'

type Props = {
  amountToShow?: number
  accountId?: string
  onTransactionClick: (transaction: TransactionDto) => void
}

export const LatestTransactions: FC<Props> = ({
  amountToShow = DEFAULT_AMOUNT_TO_SHOW,
  accountId,
  onTransactionClick,
}) => {
  const { status, data } = useQueryTransactions(accountId)

  const transactions = flow(
    sortBy<TransactionDto>((txn) => txn.startedDate),
    reverse,
  )(data)

  const noTransactions = status === 'success' && isEmpty(transactions)

  const getTransactionsList = () => {
    switch (status) {
      case 'idle':
      case 'loading':
        return <ItemSkeleton aria-label={TRANSACTIONS_LOADING_LABEL} />
      case 'success':
        return (
          <Group aria-label={LATEST_TRANSACTIONS_BLOCK_LABEL}>
            {transactions.slice(0, amountToShow).map((txn) => (
              <TransactionCard
                accountId={accountId}
                key={txn.legId}
                transaction={txn}
                showDate
                onClick={() => onTransactionClick(txn)}
              />
            ))}
          </Group>
        )
      case 'error':
        return (
          <ErrorWidget>
            <ErrorWidget.Image
              src={getAsset(
                'illustrations-repository/alert@2x.png',
                AssetProject.Business,
              )}
            />
            <ErrorWidget.Title />
          </ErrorWidget>
        )
      default:
        return null
    }
  }

  return (
    <>
      {!noTransactions && (
        <Header
          accountId={accountId}
          shouldShowSeeAllButton={transactions.length > amountToShow}
        />
      )}
      {getTransactionsList()}
    </>
  )
}
