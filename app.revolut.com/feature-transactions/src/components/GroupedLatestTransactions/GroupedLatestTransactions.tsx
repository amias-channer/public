import { VFC, useCallback } from 'react'
import { Box } from '@revolut/ui-kit'
import { Virtuoso } from 'react-virtuoso'
import { noop, isEmpty } from 'lodash'

import { TransactionDto } from '@revolut/rwa-core-types'

import { useQueryTransactions, useTransactionGroups } from '../../hooks'
import { TransactionsGroup } from '../../types'

import { RegularTransactionsGroup } from '../RegularTransactionsGroup'
import { TransactionsGroupSkeleton } from '../TransactionsGroupSkeleton'
import { NoTransactionsFound } from '../NoTransactionsFound'

type Props = {
  pocketId: string
  onTransactionItemClick?: (transaction: TransactionDto) => void
}

const OVERSCAN = 300

export const GroupedLatestTransactions: VFC<Props> = ({
  pocketId,
  onTransactionItemClick,
}) => {
  const {
    status,
    data: transactions,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useQueryTransactions(pocketId)

  const { regular } = useTransactionGroups(transactions)

  const groupRenderer = useCallback(
    (index: number, group: TransactionsGroup) => (
      <>
        <RegularTransactionsGroup
          accountId={pocketId}
          group={group}
          onTransactionItemClick={onTransactionItemClick}
        />
        {canFetchMore && index === regular.length - 1 && <TransactionsGroupSkeleton />}
      </>
    ),
    [canFetchMore, onTransactionItemClick, pocketId, regular.length],
  )

  if (status === 'loading') {
    return <TransactionsGroupSkeleton />
  }

  if (isEmpty(transactions)) {
    return <NoTransactionsFound />
  }

  return (
    <Box pb="s-72">
      <Virtuoso
        useWindowScroll
        data={regular}
        endReached={() => (canFetchMore && !isFetchingMore ? fetchMore() : noop())}
        itemContent={groupRenderer}
        overscan={OVERSCAN}
      />
    </Box>
  )
}
