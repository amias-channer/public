import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusPopup, ThemeProvider, UnifiedTheme } from '@revolut/ui-kit'

import { BaseModalProps } from '../BaseModal'

type CopiedSuccessPopupProps = BaseModalProps

export const CopiedSuccessPopup: FC<CopiedSuccessPopupProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const { t } = useTranslation('components.CopiedSuccessPopup')

  return (
    <ThemeProvider theme={UnifiedTheme}>
      <StatusPopup variant="success" isOpen={isOpen} onExit={onRequestClose}>
        <StatusPopup.Title>{t('title')}</StatusPopup.Title>
      </StatusPopup>
    </ThemeProvider>
  )
}
