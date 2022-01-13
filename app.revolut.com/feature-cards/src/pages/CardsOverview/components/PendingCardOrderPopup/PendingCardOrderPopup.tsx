import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { StatusPopup, Button } from '@revolut/ui-kit'

import { ModalComponent } from '@revolut/rwa-core-components'
import { Url } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../helpers'
import { useReplaceCurrentCardOrder } from '../../hooks'

export const PendingCardOrderPopup: ModalComponent = ({ isOpen, onRequestClose }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const history = useHistory()
  const replaceCurrentCardOrder = useReplaceCurrentCardOrder()

  const handleConfirm = async () => {
    onRequestClose()
    await replaceCurrentCardOrder()
  }

  const handleContinueOrder = () => {
    history.push(Url.CardOrderingCheckout)
  }

  return (
    <StatusPopup variant="warning" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>{t('CardOrderingPendingOrderModal.title')}</StatusPopup.Title>
      <StatusPopup.Description>
        {t('CardOrderingPendingOrderModal.text')}
      </StatusPopup.Description>
      <StatusPopup.Actions>
        <Button elevated onClick={handleConfirm}>
          {t('CardOrderingPendingOrderModal.submitButton')}
        </Button>
        <Button variant="secondary" onClick={handleContinueOrder}>
          {t('CardOrderingPendingOrderModal.secondaryButton')}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  )
}
