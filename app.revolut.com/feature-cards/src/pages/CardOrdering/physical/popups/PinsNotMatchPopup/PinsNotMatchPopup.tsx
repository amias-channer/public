import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, StatusPopup } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

export const PinsNotMatchPopup: FC<BaseModalProps> = ({ isOpen, onRequestClose }) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])

  return (
    <StatusPopup variant="error" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>{t('CardOrdering.PinsNotMatchPopup.title')}</StatusPopup.Title>
      <StatusPopup.Description>
        {t('CardOrdering.PinsNotMatchPopup.description')}
      </StatusPopup.Description>
      <StatusPopup.Actions>
        <Button elevated onClick={onRequestClose}>
          {t('common:try_again')}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  )
}
