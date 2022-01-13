import { FC } from 'react'
import { Box, Subheader, Group } from '@revolut/ui-kit'
import { useLocale } from '@revolut/rwa-core-i18n'
import { formatMoney, getFormattedDate } from '@revolut/rwa-core-utils'
import { TransactionDto } from '@revolut/rwa-core-types'
import { TransactionsGroup } from '../../types'

import { TransactionCard } from '../TransactionCard'

type Props = {
  group: TransactionsGroup
  accountId?: string
  onTransactionItemClick?: (transaction: TransactionDto) => void
}

export const RegularTransactionsGroup: FC<Props> = ({
  accountId,
  onTransactionItemClick,
  group: { groupDate, amount, currency, groupTransactions },
}) => {
  const { locale } = useLocale()
  return (
    <Box mb="s-16" role="transactions-group" data-group={new Date(groupDate).getTime()}>
      <Subheader>
        <Subheader.Title>{getFormattedDate(new Date(groupDate))}</Subheader.Title>
        <Subheader.Side>
          {amount && currency && accountId ? formatMoney(amount, currency, locale) : null}
        </Subheader.Side>
      </Subheader>
      <Group>
        {groupTransactions.map((transaction) => (
          <TransactionCard
            accountId={accountId}
            transaction={transaction}
            key={transaction.legId}
            onClick={
              onTransactionItemClick
                ? () => onTransactionItemClick(transaction)
                : undefined
            }
          />
        ))}
      </Group>
    </Box>
  )
}
