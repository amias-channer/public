import { FC } from 'react'
import { StatusPopup } from '@revolut/ui-kit'

import { useTranslation } from '../../hooks'
import { I18nNamespace } from '../../utils'

type SubmissionSubmitSuccessModalProps = {
  isOpen: boolean
  onExit: VoidFunction
}

export const SubmissionSubmitSuccessModal: FC<SubmissionSubmitSuccessModalProps> = ({
  isOpen,
  onExit,
}) => {
  const { t } = useTranslation(I18nNamespace.ComponentsModals)

  return (
    <StatusPopup variant="pending" isOpen={isOpen} onExit={onExit}>
      <StatusPopup.Title>{t('SubmissionSubmitModal.title')}</StatusPopup.Title>
      <StatusPopup.Description>
        {t('SubmissionSubmitModal.description')}
      </StatusPopup.Description>
    </StatusPopup>
  )
}
