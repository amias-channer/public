import { useTranslation } from 'react-i18next'
import { Button, StatusPopup } from '@revolut/ui-kit'

import { I18nNamespace } from '@revolut/rwa-core-utils'
import { ModalComponent } from '@revolut/rwa-core-components'

type ErrorPopupProps = {
  onClick: VoidFunction
}

export const ErrorPopup: ModalComponent<ErrorPopupProps> = ({
  isOpen,
  onClick,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  const handleClick = () => {
    onRequestClose()
    onClick()
  }

  return (
    <StatusPopup variant="error" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>{t('ErrorPopup.title')}</StatusPopup.Title>
      <StatusPopup.Actions>
        <Button elevated onClick={handleClick}>
          {t('try_again')}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  )
}
