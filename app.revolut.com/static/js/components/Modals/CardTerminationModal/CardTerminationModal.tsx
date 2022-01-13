import { useTranslation } from 'react-i18next'
import { Warning } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

type CardTerminationModalProps = {
  isCardTerminationInProgress: boolean
  onConfirm: VoidFunction
}

export const CardTerminationModal: ModalComponent<CardTerminationModalProps> = ({
  isOpen,
  isCardTerminationInProgress,
  onRequestClose,
  onConfirm,
}) => {
  const { t } = useTranslation(['pages.Cards', 'common'])

  const handleConfirm = async () => {
    await onConfirm()
    onRequestClose()
  }

  return (
    <ModalLayout
      Icon={<Warning size={IconSize.Large} color="warning" />}
      title={t('CardSettings.CardTerminationModal.title')}
      description={t('CardSettings.CardTerminationModal.text')}
      primaryButtonText={t('CardSettings.CardTerminationModal.button')}
      primaryButtonProps={{
        disabled: isCardTerminationInProgress,
        isLoading: isCardTerminationInProgress,
        onClick: handleConfirm,
      }}
      secondaryButtonText={t('common:cancel')}
      secondaryButtonProps={{
        disabled: isCardTerminationInProgress,
        onClick: onRequestClose,
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
