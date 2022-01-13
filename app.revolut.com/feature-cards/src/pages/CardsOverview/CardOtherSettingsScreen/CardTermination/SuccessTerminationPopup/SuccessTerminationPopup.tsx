import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusPopup } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

export const SuccessTerminationPopup: FC<BaseModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)

  return (
    <StatusPopup variant="success-optional" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>
        {t('CardSettings.SuccessTerminationPopup.title')}
      </StatusPopup.Title>
    </StatusPopup>
  )
}
