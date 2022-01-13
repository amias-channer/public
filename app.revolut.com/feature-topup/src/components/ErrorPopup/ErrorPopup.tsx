import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, StatusPopup } from '@revolut/ui-kit'

import { ModalComponent } from '@revolut/rwa-core-components'
import { checkRequired } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../constants'
import { TopUpContext } from '../TopUpProvider'
import { formatMoney } from '../utils'

type ErrorPopupProps = {
  onTryAnotherMethod: VoidFunction
  onRetry?: VoidFunction
}

export const ErrorPopup: ModalComponent<ErrorPopupProps> = ({
  isOpen,
  onTryAnotherMethod,
  onRetry,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { amount } = useContext(TopUpContext)

  const amountWithCurrency = formatMoney(
    checkRequired(amount, '"amount" can not be empty'),
  )

  const handleTryAnotherMethodClick = () => {
    onRequestClose()
    onTryAnotherMethod()
  }

  const handleRetryClick = () => {
    onRequestClose()
    onRetry?.()
  }

  return (
    <StatusPopup variant="error" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>
        {t('facelift.ErrorPopup.title', {
          amount: amountWithCurrency,
        })}
      </StatusPopup.Title>
      <StatusPopup.Description>
        {t('facelift.ErrorPopup.description')}
      </StatusPopup.Description>
      <StatusPopup.Actions>
        <Button elevated onClick={handleRetryClick}>
          {t('common:retry')}
        </Button>
        <Button variant="secondary" onClick={handleTryAnotherMethodClick}>
          {t('facelift.ErrorPopup.tryAnotherMethodButtonText')}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  )
}
