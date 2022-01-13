import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailsCell, chain } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'

import { useLocalisedTransactionData } from '../../../hooks'
import { I18N_NAMESPACE, TRANSACTION_STATUS_CELL_TEST_ID } from '../constants'
import { checkIsNoteChangeAvailable, checkIsTransferRefundTransaction } from '../utils'
import { StatementCell } from './StatementCell'

type Props = {
  transaction: TransactionDto
}

export const DetailsGeneral: FC<Props> = ({ transaction }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { getStatusReason, getStatus } = useLocalisedTransactionData(transaction)

  const isTransferRefundTransaction = checkIsTransferRefundTransaction(transaction)

  const isNoteChangeAvailable = checkIsNoteChangeAvailable(transaction)

  return (
    <>
      {!isTransferRefundTransaction && (
        <DetailsCell data-testid={TRANSACTION_STATUS_CELL_TEST_ID}>
          <DetailsCell.Title>{t('properties.status')}</DetailsCell.Title>
          <DetailsCell.Content>
            {chain(getStatus(), getStatusReason())}
          </DetailsCell.Content>
        </DetailsCell>
      )}

      <StatementCell transaction={transaction} />

      {transaction?.comment && !isNoteChangeAvailable && (
        <DetailsCell>
          <DetailsCell.Title>{t('properties.note')}</DetailsCell.Title>
          <DetailsCell.Content>{transaction.comment}</DetailsCell.Content>
        </DetailsCell>
      )}
    </>
  )
}
