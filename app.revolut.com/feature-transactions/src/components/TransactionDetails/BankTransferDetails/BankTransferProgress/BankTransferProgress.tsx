import { VFC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, DetailsCell, ProgressStep, ProgressSteps } from '@revolut/ui-kit'

import { TransactionRefundDto } from '@revolut/rwa-core-types'

import { I18N_NAMESPACE } from '../../constants'
import { SuspiciousPaymentTrackingStatus, TransactionTrackingStageData } from './types'
import { fixCompletedDateChronology, getGroupTitle } from './utils'
import { prepareProgressData } from './prepareProgressData'

type BankTransferProgressProps = {
  tracking: TransactionTrackingStageData[]
  refund?: TransactionRefundDto
  suspiciousPaymentTrackingStatus?: SuspiciousPaymentTrackingStatus
  onTransactionLinkClick?: (transactionId: string) => void
}

export const BankTransferProgress: VFC<BankTransferProgressProps> = ({
  tracking,
  refund,
  suspiciousPaymentTrackingStatus,
  onTransactionLinkClick,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const fixedTracking = fixCompletedDateChronology(tracking)
  const data = prepareProgressData(fixedTracking, refund, suspiciousPaymentTrackingStatus)

  return (
    <DetailsCell>
      <DetailsCell.Title>
        {getGroupTitle(fixedTracking, suspiciousPaymentTrackingStatus, t)}
      </DetailsCell.Title>

      <DetailsCell.Note>
        <Box mt="s-24">
          <ProgressSteps variant="vertical">
            {data.map((item) => {
              return (
                <ProgressStep key={item.key} done={item.done} color={item.color}>
                  <ProgressStep.Title>{item.renderTitle({ t })}</ProgressStep.Title>

                  {item.renderSubtitle && (
                    <ProgressStep.Description>
                      {item.renderSubtitle({
                        t,
                        onViewRefundAction:
                          refund && onTransactionLinkClick
                            ? () => onTransactionLinkClick(refund.id)
                            : undefined,
                      })}
                    </ProgressStep.Description>
                  )}

                  {item.date && (
                    <ProgressStep.Caption>
                      {item.date.isEstimated && (
                        <Box>{t('field.progress.estimatedShortDate')}</Box>
                      )}
                      {item.date.value}
                    </ProgressStep.Caption>
                  )}
                </ProgressStep>
              )
            })}
          </ProgressSteps>
        </Box>
      </DetailsCell.Note>
    </DetailsCell>
  )
}
