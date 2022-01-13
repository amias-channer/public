import { useTranslation } from 'react-i18next'
import { StatusPopup } from '@revolut/ui-kit'

import { I18nNamespace } from '@revolut/rwa-core-utils'

import { ModalComponent } from '../types'

export const ErrorPopup: ModalComponent = ({ isOpen, onRequestClose, title }) => {
  const { t } = useTranslation(I18nNamespace.Common)

  return (
    <StatusPopup variant="error" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>{title || t('ErrorPopup.title')}</StatusPopup.Title>
    </StatusPopup>
  )
}
