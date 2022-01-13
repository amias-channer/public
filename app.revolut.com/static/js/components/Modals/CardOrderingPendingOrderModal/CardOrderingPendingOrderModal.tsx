import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Warning } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize, Url } from '@revolut/rwa-core-utils'

type CardOrderingPendingOrderModalProps = {
  onSubmit: VoidFunction
}

export const CardOrderingPendingOrderModal: ModalComponent<CardOrderingPendingOrderModalProps> =
  ({ isOpen, onRequestClose, onSubmit }) => {
    const { t } = useTranslation('pages.Cards')
    const history = useHistory()

    const handleConfirm = () => {
      onRequestClose()
      onSubmit()
    }

    const handleContinueOrder = () => {
      history.push(Url.CardOrderingTopUp)
    }

    return (
      <ModalLayout
        Icon={<Warning size={IconSize.Large} color="warning" />}
        title={t('CardOrderingPendingOrderModal.title')}
        description={t('CardOrderingPendingOrderModal.text')}
        primaryButtonText={t('CardOrderingPendingOrderModal.submitButton')}
        primaryButtonProps={{
          onClick: handleConfirm,
        }}
        secondaryButtonText={t('CardOrderingPendingOrderModal.secondaryButton')}
        secondaryButtonProps={{ onClick: handleContinueOrder }}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      />
    )
  }
