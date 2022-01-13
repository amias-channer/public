import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@revolut/icons'

import { BaseModalProps, ModalLayout } from '@revolut/rwa-core-components'
import { IconSize } from '@revolut/rwa-core-utils'

type CardReportModalProps = BaseModalProps & {
  onConfirm: VoidFunction
}

export const CardReportModal: FC<CardReportModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
}) => {
  const { t } = useTranslation(['pages.Cards', 'common'])

  const handleConfirm = () => {
    onRequestClose()
    onConfirm()
  }

  return (
    <ModalLayout
      Icon={<Card size={IconSize.ExtraLarge} color="primary" />}
      title={t('CardSettings.report.modal.title')}
      description={t('CardSettings.report.modal.text')}
      primaryButtonText={t('CardSettings.report.modal.button')}
      primaryButtonProps={{
        onClick: handleConfirm,
      }}
      secondaryButtonText={t('common:cancel')}
      secondaryButtonProps={{ onClick: onRequestClose }}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    />
  )
}
