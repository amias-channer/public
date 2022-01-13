import { useTranslation } from 'react-i18next'
import { StatusPopup } from '@revolut/ui-kit'

import { ModalComponent } from '@revolut/rwa-core-components'

import { I18N_NAMESPACE } from '../constants'

type SuccessPopupProps = {
  title?: string
  description?: string
  onAutoHide: VoidFunction
}

export const SuccessPopup: ModalComponent<SuccessPopupProps> = ({
  isOpen,
  title,
  description,
  onAutoHide,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const defaultTitle = t('facelift.SuccessPopup.title')

  const handleExit = () => {
    onRequestClose()
    onAutoHide()
  }

  return (
    <StatusPopup variant="success" isOpen={isOpen} onExit={handleExit}>
      <StatusPopup.Title>{title || defaultTitle}</StatusPopup.Title>
      {description && <StatusPopup.Description>{description}</StatusPopup.Description>}
    </StatusPopup>
  )
}
