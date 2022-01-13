import { VFC } from 'react'
import { Group } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'

import { GroupWrapper } from '../components'
import { TransferRefundStatus } from './TransferRefundStatus'

type Props = {
  transaction: TransactionDto
  onTransactionLinkClick?: (transactionId: string) => void
}

export const TransferRefundDetails: VFC<Props> = ({
  transaction,
  onTransactionLinkClick,
}) => (
  <GroupWrapper>
    <Group>
      <TransferRefundStatus
        transaction={transaction}
        onTransactionLinkClick={onTransactionLinkClick}
      />
    </Group>
  </GroupWrapper>
)
