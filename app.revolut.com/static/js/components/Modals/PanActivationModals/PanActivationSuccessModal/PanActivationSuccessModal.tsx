import { useTranslation } from 'react-i18next'
import { Check } from '@revolut/icons'

import { ModalComponent, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

export const PanActivationSuccessModal: ModalComponent = ({ isOpen, onRequestClose }) => {
  const { t } = useTranslation(['pages.Cards', 'common'])

  return (
    <ModalLayout
      Icon={<Check size={IconSize.ExtraLarge} color="primary" />}
      title={t('PanActivationSuccessModal.title')}
      primaryButtonText={t('common:close')}
      primaryButtonProps={{
        onClick: onRequestClose,
      }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
