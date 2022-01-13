import * as React from 'react'
import { H1, Chain, Flex, Box } from '@revolut/ui-kit'

import { Bullet } from '@revolut/rwa-core-components'
import { TransactionDto } from '@revolut/rwa-core-types'
import {
  DateTime,
  getMoneyProps,
  transactionPropertyChecker,
  useLocalisedTransactionData,
  MoneyLabel,
} from '@revolut/rwa-feature-transactions'

import { getIcon, getTransactionBulletProps } from 'components/Transactions/helpers'
import { TransactionIcon } from 'components/Transactions/TransactionIcon'

type Props = {
  transaction: TransactionDto
}

export const TransactionDetailsHeader: React.FC<Props> = ({ transaction }) => {
  const { getTitle } = useLocalisedTransactionData(transaction)
  const transactionDate = transaction.startedDate
  const moneyProps = getMoneyProps(transaction)

  const bulletProps = getTransactionBulletProps(transaction)

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      data-cy="transaction-details-header"
    >
      <Box>
        <H1>
          <MoneyLabel {...moneyProps.main} isGrey={false} textProps={{ variant: 'h1' }} />
        </H1>
        <Box color="transactionDetailTitle" mt="px4">
          <Chain>
            <Chain.Item>{getTitle()}</Chain.Item>
            <Chain.Item>
              <DateTime datetime={transactionDate} />
            </Chain.Item>
          </Chain>
        </Box>
      </Box>
      <Bullet.Anchor>
        <TransactionIcon
          icon={getIcon(transaction)}
          reversed={transactionPropertyChecker.isIncoming(transaction)}
        />
        <Bullet bg={bulletProps?.bulletBackground} color="white">
          {bulletProps?.bullet}
        </Bullet>
      </Bullet.Anchor>
    </Flex>
  )
}
