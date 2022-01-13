import { FC, ReactNode } from 'react'
import * as Icons from '@revolut/icons'
import { Card, Chain } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'
import { MoneyLabel, MoneyProps } from '@revolut/rwa-feature-transactions'

import { PaymentCard } from 'components/Transactions/PaymentCard'
import { TransactionIcon } from 'components/Transactions/TransactionIcon'

import { BulletBackground } from '../../helpers/getTransactionBulletProps'
import { StatusText, StyledChain } from './styled'

type TransactionCardProps = {
  bullet?: ReactNode
  bulletBackground?: BulletBackground
  comment: TransactionDto['comment']
  counterpartMoney?: MoneyProps['counterpart']
  date?: ReactNode
  icon?: string | Icons.UiKitIconComponentType
  isFlat?: boolean
  isInteractive?: boolean
  legId: TransactionDto['legId']
  money: MoneyProps['main']
  onClick: VoidFunction
  pocketId?: string
  reversed: boolean
  statusText?: string
  transactionId: TransactionDto['id']
} & React.ComponentPropsWithoutRef<typeof Card>

export const TransactionCard: FC<TransactionCardProps> = ({
  bullet,
  bulletBackground,
  comment,
  counterpartMoney,
  date,
  icon,
  legId,
  money,
  onClick,
  reversed,
  statusText,
  title,
}) => (
  <PaymentCard
    id={legId}
    data-testid={`transaction-${legId}`}
    avatar={<TransactionIcon icon={icon} reversed={reversed} />}
    bullet={bullet}
    bulletColor={bulletBackground}
    title={title}
    amount={<MoneyLabel {...money} />}
    onClick={onClick}
    secondaryValue={
      counterpartMoney && <MoneyLabel {...counterpartMoney} isGrey fontSize="0.9375rem" />
    }
    details={
      <StyledChain>
        {statusText && (
          <Chain.Item>
            <StatusText>{statusText}</StatusText>
          </Chain.Item>
        )}
        {date && <Chain.Item>{date}</Chain.Item>}
        {comment && (
          <Chain.Item>
            <StatusText title={comment}>{comment}</StatusText>
          </Chain.Item>
        )}
      </StyledChain>
    }
    isFlat
  />
)
