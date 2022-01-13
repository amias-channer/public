import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusPopup } from '@revolut/ui-kit'

import { I18nNamespace } from '../../utils'

type SubmissionCreateErrorModalProps = {
  isOpen?: boolean
  onExit: VoidFunction
}

export const SubmissionCreateErrorModal: FC<SubmissionCreateErrorModalProps> = ({
  isOpen = false,
  onExit,
}) => {
  const { t } = useTranslation(I18nNamespace.Error)

  return (
    <StatusPopup variant="error" isOpen={isOpen} onExit={onExit}>
      <StatusPopup.Title>{t('title')}</StatusPopup.Title>
      <StatusPopup.Description>{t('description')}</StatusPopup.Description>
    </StatusPopup>
  )
}
