import { useTranslation } from 'react-i18next'
import { Check } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

export const CardUnlockSuccessModal: ModalComponent = ({ isOpen, onRequestClose }) => {
  const { t } = useTranslation(['pages.Cards', 'common'])

  return (
    <ModalLayout
      Icon={<Check size={IconSize.ExtraLarge} color="primary" />}
      title={t('CardSettings.unlockSuccess.modal.title')}
      description={t('CardSettings.unlockSuccess.modal.text')}
      primaryButtonText={t('common:done')}
      primaryButtonProps={{
        onClick: onRequestClose,
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
