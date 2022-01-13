import { useTranslation } from 'react-i18next'
import { Warning } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

export const CardOrderingUnsupportedAddressModal: ModalComponent = ({
  isOpen,
  onRequestClose,
}) => {
  const { t } = useTranslation(['pages.Cards'])

  return (
    <ModalLayout
      Icon={<Warning size={IconSize.Large} color="warning" />}
      title={t('CardOrderingUnsupportedAddressModal.title')}
      primaryButtonText={t('CardOrderingUnsupportedAddressModal.submitButton')}
      primaryButtonProps={{
        onClick: onRequestClose,
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
