import { VFC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { chain, DetailsCell, TextButton } from '@revolut/ui-kit'

import { TransactionDto } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import { useLocalisedTransactionData } from '../../../hooks'
import { I18N_NAMESPACE } from '../constants'

type Props = {
  transaction: TransactionDto
  onTransactionLinkClick?: (transactionId: string) => void
}

export const TransferRefundStatus: VFC<Props> = ({
  transaction,
  onTransactionLinkClick,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { getStatus } = useLocalisedTransactionData(transaction)

  const statusDescription = (
    <Trans
      t={t}
      i18nKey="TransferRefundStatus.description"
      components={{
        transactionLink: onTransactionLinkClick ? (
          <TextButton
            variant="primary"
            onClick={() =>
              onTransactionLinkClick(checkRequired(transaction.relatedTransactionId))
            }
          />
        ) : (
          <></>
        ),
      }}
    />
  )

  return (
    <DetailsCell>
      <DetailsCell.Title>{t('properties.status')}</DetailsCell.Title>
      <DetailsCell.Note>{chain(getStatus(), statusDescription)}</DetailsCell.Note>
    </DetailsCell>
  )
}
