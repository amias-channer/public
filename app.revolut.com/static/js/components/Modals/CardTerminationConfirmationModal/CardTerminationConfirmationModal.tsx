import { useTranslation } from 'react-i18next'

import {
  ExclamationMarkOutlinedIcon,
  ModalComponent,
  ModalLayout,
} from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

type CardTerminationConfirmationModalProps = {
  onTerminationConfirmed: VoidFunction
}

export const CardTerminationConfirmationModal: ModalComponent<CardTerminationConfirmationModalProps> =
  ({ isOpen, onRequestClose, onTerminationConfirmed }) => {
    const { t } = useTranslation('components.Modals')

    return (
      <ModalLayout
        Icon={<ExclamationMarkOutlinedIcon size={IconSize.ExtraLarge} color="warning" />}
        title={t('CardTerminationConfirmationModal.title')}
        description={t('CardTerminationConfirmationModal.description')}
        primaryButtonText={t('CardTerminationConfirmationModal.confirmButton')}
        primaryButtonProps={{
          onClick: onTerminationConfirmed,
        }}
        secondaryButtonText={t('CardTerminationConfirmationModal.cancelButton')}
        secondaryButtonProps={{ onClick: onRequestClose }}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      />
    )
  }
