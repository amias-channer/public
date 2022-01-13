import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Box, Flex, Chain } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'
import { useLocalisedTransactionData } from '@revolut/rwa-feature-transactions'

import { I18N_NAMESPACE } from './constants'
import { ExchangeDetails } from './ExchangeDetails'
import { TransactionCard } from './TransactionCard'

type Props = {
  transaction: TransactionDto
}

export const TransactionDetailsGeneral: React.FC<Props> = ({ transaction }) => {
  const { getStatus, getStatusReason } = useLocalisedTransactionData(transaction)
  const { t } = useTranslation(I18N_NAMESPACE)

  const status = getStatus()
  const statusReason = getStatusReason()

  return (
    <Card variant="plain" p="px24" data-cy="transaction-details-properties">
      <Flex justifyContent="space-between" data-cy="transaction-status" flexWrap="wrap">
        <Box color="transactionDetailPropName">{t('properties.status')}</Box>
        <Box>
          <Chain>
            <Chain.Item>{status}</Chain.Item>
            {statusReason && <Chain.Item>{statusReason}</Chain.Item>}
          </Chain>
        </Box>
      </Flex>

      {transaction.comment && (
        <Flex justifyContent="space-between" mt="px16">
          <Box color="transactionDetailPropName">{t('properties.note')}</Box>
          <Box>{transaction.comment}</Box>
        </Flex>
      )}

      {transaction.counterpart?.currency &&
        transaction.counterpart?.currency !== transaction.currency && (
          <ExchangeDetails
            amount={transaction.counterpart.amount}
            currencyTo={transaction.counterpart.currency}
            currencyFrom={transaction.currency}
            rate={transaction.rate}
          />
        )}

      {transaction.card && <TransactionCard card={transaction.card} />}
    </Card>
  )
}
