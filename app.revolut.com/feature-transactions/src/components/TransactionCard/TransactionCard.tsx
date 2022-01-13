import { FC, ReactNode } from 'react'
import { Item, chain, Flex, Ellipsis, Box, Color, Text } from '@revolut/ui-kit'
import { useHistory } from 'react-router-dom'

import { Time } from '@revolut/rwa-core-components'
import { TransactionDto, TransactionStatusReasonCodes } from '@revolut/rwa-core-types'
import { getTransactionDetailsUrl, getFormattedDate } from '@revolut/rwa-core-utils'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { FeatureKey } from '@revolut/rwa-core-config'

import { useLocalisedTransactionData } from '../../hooks'
import { getMoneyProps, transactionPropertyChecker } from '../../utils'
import { MoneyLabel } from '../MoneyLabel'
import { TransactionAvatar } from '../TransactionAvatar'

export type Props = {
  transaction: TransactionDto
  accountId?: string
  showDate?: boolean
  additionalText?: ReactNode
  onClick?: VoidFunction
}

const getComment = (transaction: TransactionDto) => {
  const isSuspicious = transactionPropertyChecker.isSuspicious(transaction)
  return isSuspicious ? undefined : transaction.comment
}

export const TransactionCard: FC<Props> = ({
  transaction,
  showDate,
  additionalText,
  accountId,
  onClick,
}) => {
  const { getTitle, getStatusReason, getStatus, getSuspiciousTransferWarning } =
    useLocalisedTransactionData(transaction)

  const { isFeatureActive } = useFeaturesConfig()

  const history = useHistory()

  const getStatusText = (txn: TransactionDto) => {
    if (transactionPropertyChecker.hasErrorStatus(txn)) {
      return getStatusReason() || getStatus()
    }

    if (transactionPropertyChecker.isPending(txn)) {
      return !txn.vault?.expectedArrival ? getStatusReason() || getStatus() : undefined
    }

    return undefined
  }

  const comment = getComment(transaction)

  const statusText = getStatusText(transaction)
  const counterpartMoney = getMoneyProps(transaction).counterpart

  const onClickDefault = () => {
    history.push(getTransactionDetailsUrl(transaction.id, transaction.legId, accountId))
  }
  return (
    <Item
      key={transaction.legId}
      data-transactionid={transaction.legId}
      use="button"
      onClick={onClick || onClickDefault}
    >
      <Item.Avatar>
        <TransactionAvatar transaction={transaction} />
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{getTitle()}</Item.Title>
        <Item.Description>
          <Ellipsis>
            <Flex>
              {chain(
                statusText,
                showDate && getFormattedDate(new Date(transaction.startedDate)),
                <Time value={transaction.startedDate} />,
                comment,
              )}
            </Flex>
          </Ellipsis>
          {additionalText && <Box>{additionalText}</Box>}
          {isFeatureActive(FeatureKey.SuspiciousTransfer) && // TODO: remove after 100% deploy of suspicious transfer
            TransactionStatusReasonCodes.SuspiciousTransactionUserActionRequired ===
              transaction.reason && (
              <Text color={Color.WARNING}>{getSuspiciousTransferWarning()}</Text>
            )}
        </Item.Description>
      </Item.Content>
      <Item.Side>
        <Item.Value>
          <MoneyLabel {...getMoneyProps(transaction).main} />
        </Item.Value>
        <Item.Value variant="secondary">
          {counterpartMoney && <MoneyLabel {...counterpartMoney} isGrey />}
        </Item.Value>
      </Item.Side>
    </Item>
  )
}
