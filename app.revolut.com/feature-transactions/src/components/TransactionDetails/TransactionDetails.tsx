import { noop } from 'lodash'
import { FC, useEffect } from 'react'
import { Box } from '@revolut/ui-kit'
import { useQueryClient } from 'react-query'
import { useTranslation } from 'react-i18next'

import { trackEvent, TransactionTrackingEvent } from '@revolut/rwa-core-analytics'
import { useQueryTransactionById } from '@revolut/rwa-core-api'
import { FeatureKey } from '@revolut/rwa-core-config'
import { useLocaleFormatMoney } from '@revolut/rwa-core-i18n'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { TransactionDto, TransactionType } from '@revolut/rwa-core-types'
import {
  checkIfCryptoCurrency,
  checkIfFiatCurrency,
  useDelayedLoadingState,
  QueryKey,
} from '@revolut/rwa-core-utils'
import {
  isSuspiciousTransfer,
  Banner as SuspiciousTransferBanner,
} from '@revolut/rwa-feature-suspicious-transfer'

import { transactionPropertyChecker } from '../../utils'
import {
  TransactionNoteWidget,
  DetailsHeader,
  GroupWrapper,
  SuspiciousTransactionWidget,
  TransactionDetailsSkeleton,
} from './components'
import { DETAILS_TEST_ID, DetailsScreenSource, I18N_NAMESPACE } from './constants'
import { GenericDetails } from './GenericDetails'
import { BankTransferDetails } from './BankTransferDetails'
import { checkIsNoteChangeAvailable, checkIsTransferRefundTransaction } from './utils'
import { TransferRefundDetails } from './TransferRefundDetails'
import { checkIfCryptoExchange } from '../../utils/transactionPropertyChecker'

const getTransactionSingleEntity = (
  transaction?: TransactionDto[],
  legId?: string,
): TransactionDto | undefined => {
  if (!transaction) {
    return undefined
  }

  return legId ? transaction.find((entity) => entity.legId === legId) : transaction[0]
}

export type TransactionDetailsProps = {
  transactionId: string
  transactionLegId?: string
  source?: DetailsScreenSource
  onBackButtonClick?: VoidFunction
  onTransactionLinkClick?: (transactionId: string) => void
}

export const TransactionDetails: FC<TransactionDetailsProps> = ({
  transactionId,
  transactionLegId: legId,
  source,
  onBackButtonClick,
  onTransactionLinkClick,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const queryClient = useQueryClient()
  const localeFormatMoney = useLocaleFormatMoney()

  const {
    data,
    isLoading,
    refetch: refetchTransaction,
  } = useQueryTransactionById(transactionId)
  const transactionData = getTransactionSingleEntity(data, legId)

  const transaction = useDelayedLoadingState<TransactionDto>(transactionData, isLoading)
  const { isFeatureActive } = useFeaturesConfig()

  useEffect(() => {
    if (!transaction) {
      return noop
    }

    trackEvent(TransactionTrackingEvent.detailsOpened, {
      transactionId,
      transactionLegId: transaction.legId,
      state: transaction.state,
      source: source ?? DetailsScreenSource.AllTransactions,
    })

    return () => {
      trackEvent(TransactionTrackingEvent.detailsClosed, {
        transactionId,
        transactionLegId: transaction.legId,
      })
    }
  }, [source, transaction, transactionId])

  if (!transaction) {
    return <TransactionDetailsSkeleton />
  }

  const handleNoteChanged = () => {
    refetchTransaction()
    queryClient.refetchQueries([QueryKey.Transactions])
  }

  const isTransferTransaction =
    isFeatureActive(FeatureKey.AllowPayments) &&
    transaction.type === TransactionType.Transfer &&
    Boolean(transaction.beneficiary) &&
    Boolean(transaction.counterpart)

  const isTransferRefundTransaction = checkIsTransferRefundTransaction(transaction)

  const isNoteChangeAvailable = checkIsNoteChangeAvailable(transaction)

  const transactionWithFee = data?.find((entity) => entity.fee > 0)

  const transactionFeeFormatted = transactionWithFee
    ? localeFormatMoney(transactionWithFee.fee, transactionWithFee.currency)
    : t('fees.noFees')

  const transactionRate =
    checkIfCryptoExchange(transaction) && checkIfFiatCurrency(transaction.currency)
      ? data?.find((entity) => checkIfCryptoCurrency(entity.currency))?.rate
      : transaction.rate

  return (
    <Box data-testid={DETAILS_TEST_ID} mb="-s-24">
      <DetailsHeader transaction={transaction} onBackButtonClick={onBackButtonClick} />

      {isFeatureActive(FeatureKey.SuspiciousTransfer) &&
        isSuspiciousTransfer(transaction.reason) && (
          <GroupWrapper>
            <SuspiciousTransferBanner transactionId={transactionId} />
          </GroupWrapper>
        )}

      {transactionPropertyChecker.isSuspicious(transaction) && (
        <GroupWrapper>
          <SuspiciousTransactionWidget transaction={transaction} />
        </GroupWrapper>
      )}

      {isTransferRefundTransaction && (
        <TransferRefundDetails
          transaction={transaction}
          onTransactionLinkClick={onTransactionLinkClick}
        />
      )}

      {isTransferTransaction ? (
        <BankTransferDetails
          transaction={transaction}
          onTransactionLinkClick={onTransactionLinkClick}
        />
      ) : (
        <GenericDetails
          transaction={{ ...transaction, rate: transactionRate }}
          transactionFee={transactionFeeFormatted}
        />
      )}

      {isNoteChangeAvailable && (
        <TransactionNoteWidget
          transaction={transaction}
          onNoteChanged={handleNoteChanged}
        />
      )}
    </Box>
  )
}
