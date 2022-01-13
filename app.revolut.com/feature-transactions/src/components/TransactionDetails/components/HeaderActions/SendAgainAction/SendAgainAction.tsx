import { VFC } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@revolut/ui-kit'
import { ArrowSend as ArrowSendIcon } from '@revolut/icons'

import { checkRequired, getPaymentAmountUrl } from '@revolut/rwa-core-utils'
import { TransactionDto } from '@revolut/rwa-core-types'

import { I18N_NAMESPACE } from '../../../constants'

type DetailsActionsProps = {
  transaction: TransactionDto
}

export const SendAgainAction: VFC<DetailsActionsProps> = ({ transaction }) => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)

  const handleSendAgainActionClick = () => {
    const beneficiaryId = checkRequired(
      transaction.beneficiary?.id,
      '"beneficiaryId" can not be empty',
    )
    const moneyAmount = Math.abs(transaction.counterpart?.amount ?? transaction.amount)

    history.push(getPaymentAmountUrl(beneficiaryId), {
      moneyAmount,
      pocketCurrency: transaction.currency,
      reference: transaction.comment,
    })
  }

  return (
    <Button useIcon={ArrowSendIcon} size="sm" onClick={handleSendAgainActionClick}>
      {t('HeaderActions.sendAgain.title')}
    </Button>
  )
}
