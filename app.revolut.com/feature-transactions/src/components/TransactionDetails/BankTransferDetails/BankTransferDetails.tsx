import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailsCell } from '@revolut/ui-kit'

import { BeneficiaryAccountDetails } from '@revolut/rwa-core-components'
import { MoneyDto, TransactionDto } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../constants'
import { GroupWrapper, StatementCell } from '../components'
import {
  BankTransferProgress,
  TransactionTrackingStageData,
} from './BankTransferProgress'
import { BankTransferAmount } from './BankTransferAmount'
import { getSuspiciousPaymentTrackingStatus } from './BankTransferProgress/utils'

type BankTransferDetailsProps = {
  transaction: TransactionDto
  onTransactionLinkClick?: (transactionId: string) => void
}

/**
 * Please see
 * revolut-android/app_retail/feature_transactions_impl/src/main/kotlin/com/revolut/feature/transactions/impl/ui/transactiondetails/content_provider/BankTransferContentProvider.kt
 */
export const BankTransferDetails: VFC<BankTransferDetailsProps> = ({
  transaction,
  onTransactionLinkClick,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const tracking = transaction.tracking?.map<TransactionTrackingStageData>((stage) => ({
    ...stage,
    transactionCreatedDate: transaction.createdDate,
  }))

  const fees = transaction.fee
    ? { currency: transaction.currency, amount: transaction.fee }
    : undefined
  const recipientGets = checkRequired(
    transaction.counterpart,
    '"counterpart" can not be empty',
  ) as MoneyDto

  const beneficiaryAccount = checkRequired(
    transaction.beneficiary?.account,
    '"beneficiaryAccount" can not be empty',
  )

  return (
    <>
      {transaction?.comment && (
        <GroupWrapper>
          <DetailsCell>
            <DetailsCell.Title>{t('field.reference')}</DetailsCell.Title>
            <DetailsCell.Note>{transaction.comment}</DetailsCell.Note>
          </DetailsCell>
        </GroupWrapper>
      )}

      {tracking && (
        <GroupWrapper>
          <BankTransferProgress
            tracking={tracking}
            refund={transaction.refund}
            suspiciousPaymentTrackingStatus={getSuspiciousPaymentTrackingStatus(
              transaction.reason,
            )}
            onTransactionLinkClick={onTransactionLinkClick}
          />
        </GroupWrapper>
      )}

      <GroupWrapper>
        <StatementCell transaction={transaction} />
      </GroupWrapper>

      <GroupWrapper>
        <BankTransferAmount
          fees={fees}
          rate={transaction.rate}
          recipientGets={recipientGets}
          yourTotal={{ currency: transaction.currency, amount: transaction.amount }}
        />
      </GroupWrapper>

      <GroupWrapper>
        <BeneficiaryAccountDetails account={beneficiaryAccount} />
      </GroupWrapper>
    </>
  )
}
