import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Card, Chain, TextBox } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'
import { MoneyLabel, MoneyProps } from '@revolut/rwa-feature-transactions'

import { PaymentCard } from 'components/Transactions/PaymentCard'
import { TransactionIcon } from 'components/Transactions/TransactionIcon'

import { BulletBackground } from '../../helpers/getTransactionBulletProps'
import { StatusText, StyledChain } from './styled'

export const SUSPICIOUS_TRANSACTION_CARD_TEST_ID = 'suspicious-transaction-card'

type Props = {
  legId: string
  bullet?: ReactNode
  bulletBackground?: BulletBackground
  comment: TransactionDto['comment']
  counterpartMoney?: MoneyProps['counterpart']
  date?: ReactNode
  icon?: string | Icons.UiKitIconComponentType
  money: MoneyProps['main']
  onClick: VoidFunction
  statusText?: string
} & React.ComponentPropsWithoutRef<typeof Card>

export const SuspiciousTransactionCard: FC<Props> = ({
  legId,
  bullet,
  bulletBackground,
  comment,
  counterpartMoney,
  date,
  icon,
  money,
  onClick,
  title,
}) => {
  const { t } = useTranslation(I18nNamespace.Domain)
  return (
    <PaymentCard
      data-testid={SUSPICIOUS_TRANSACTION_CARD_TEST_ID}
      id={legId}
      avatar={<TransactionIcon icon={icon} reversed={false} />}
      bullet={bullet}
      bulletColor={bulletBackground}
      title={title}
      amount={<MoneyLabel {...money} />}
      onClick={onClick}
      secondaryValue={
        counterpartMoney && <MoneyLabel {...counterpartMoney} isGrey fontSize="smaller" />
      }
      details={
        <StyledChain>
          {date && <Chain.Item>{date}</Chain.Item>}
          {comment && (
            <Chain.Item>
              <StatusText title={comment}>{comment}</StatusText>
            </Chain.Item>
          )}
        </StyledChain>
      }
      comment={
        <TextBox color="warning" fontSize="smaller" mt="-0.25rem">
          {t('card-suspicious-was_this_you')}
        </TextBox>
      }
      isFlat
    />
  )
}
