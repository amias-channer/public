import { useTranslation } from 'react-i18next'
import { StatusPopup } from '@revolut/ui-kit'

import { ModalComponent } from '@revolut/rwa-core-components'

export const StatementPendingPopup: ModalComponent = ({ isOpen, onRequestClose }) => {
  const { t } = useTranslation('components.StatementPendingPopup')

  return (
    <StatusPopup variant="pending" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>{t('title')}</StatusPopup.Title>
      <StatusPopup.Description>{t('description')}</StatusPopup.Description>
    </StatusPopup>
  )
}
