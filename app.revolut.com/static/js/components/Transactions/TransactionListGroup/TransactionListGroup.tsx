import * as React from 'react'
import { Box } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'

import { CARD_PADDING, CARD_HEIGHT } from '../constants'
import { TransactionsListCard } from './TransactionsListCard'
import { TransactionsListGroupHeader } from './TransactionsListGroupHeader'
import { TransactionsListGroupTitle } from './TransactionsListGroupTitle'

export const GROUP_ROLE_NAME = 'transactions-group'

type Props = {
  titleOnLeft: string | React.ReactNode
  titleOnRight?: string | React.ReactNode
  groupHeight?: number
  pocketId?: string
  transactions: TransactionDto[]
}

export const TransactionListGroup: React.FC<Props> = ({
  titleOnLeft,
  titleOnRight,
  groupHeight,
  transactions,
  pocketId,
}) => {
  return (
    <Box height={groupHeight} mx={{ _: '-16px', mobile: 0 }} role={GROUP_ROLE_NAME}>
      <TransactionsListGroupHeader>
        <TransactionsListGroupTitle>{titleOnLeft}</TransactionsListGroupTitle>
        {titleOnRight ? (
          <TransactionsListGroupTitle>{titleOnRight}</TransactionsListGroupTitle>
        ) : null}
      </TransactionsListGroupHeader>
      <Box
        bg="white"
        pt={`${CARD_PADDING}px`}
        pb={`${CARD_PADDING}px`}
        radius="card"
        mx={{ all: 0, md: 0 }}
      >
        {transactions.map((transaction) => (
          <TransactionsListCard
            key={transaction.legId}
            transaction={transaction}
            height={`${CARD_HEIGHT}px`}
            pocketId={pocketId}
          />
        ))}
      </Box>
    </Box>
  )
}
