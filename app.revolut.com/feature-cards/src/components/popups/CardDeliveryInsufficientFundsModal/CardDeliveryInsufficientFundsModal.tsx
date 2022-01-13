import { useTranslation } from 'react-i18next'
import { Warning } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { Currency } from '@revolut/rwa-core-types'
import { I18nNamespace, IconSize } from '@revolut/rwa-core-utils'

type CardDeliveryInsufficientFundsModalProps = {
  currency?: Currency
  onConfirm: VoidFunction
}

export const CardDeliveryInsufficientFundsModal: ModalComponent<CardDeliveryInsufficientFundsModalProps> =
  ({ currency, isOpen, onConfirm, onRequestClose }) => {
    const { t } = useTranslation(['pages.Cards', I18nNamespace.Common])

    const handleConfirm = () => {
      onRequestClose()
      onConfirm()
    }

    return (
      <ModalLayout
        Icon={<Warning size={IconSize.Large} color="warning" />}
        title={t('CardDeliveryInsufficientFundsModal.title')}
        description={t('CardDeliveryInsufficientFundsModal.text', { currency })}
        primaryButtonText={t('CardDeliveryInsufficientFundsModal.submitButton')}
        primaryButtonProps={{
          onClick: handleConfirm,
        }}
        secondaryButtonText={t('common:cancel')}
        secondaryButtonProps={{ onClick: onRequestClose }}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      />
    )
  }
