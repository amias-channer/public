import noop from 'lodash/noop'
import { useTranslation } from 'react-i18next'
import { Lock } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

type CardUnlockConfirmModalProps = {
  isLoading: boolean
  onConfirm: VoidFunction
}

export const CardUnlockConfirmModal: ModalComponent<CardUnlockConfirmModalProps> = ({
  isOpen,
  isLoading,
  onRequestClose,
  onConfirm,
}) => {
  const { t } = useTranslation(['pages.Cards', 'common'])

  return (
    <ModalLayout
      Icon={<Lock size={IconSize.ExtraLarge} color="primary" />}
      title={t('CardSettings.unlockRequest.modal.title')}
      description={t('CardSettings.unlockRequest.modal.text')}
      primaryButtonText={t('CardSettings.unlockRequest.modal.button')}
      primaryButtonProps={{
        disabled: isLoading,
        onClick: onConfirm,
      }}
      secondaryButtonText={t('common:cancel')}
      secondaryButtonProps={{ disabled: isLoading, onClick: onRequestClose }}
      isOpen={isOpen}
      onRequestClose={isLoading ? noop : onRequestClose}
    />
  )
}
