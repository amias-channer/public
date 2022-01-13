import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Popup, Text } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../../helpers'

type CardReportPopupProps = {
  onReportClick: VoidFunction
} & BaseModalProps

export const CardReportPopup: FC<CardReportPopupProps> = ({
  isOpen,
  onReportClick,
  onRequestClose,
}) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])

  return (
    <Popup variant="bottom-sheet" isOpen={isOpen} onExit={onRequestClose}>
      <Popup.Header>
        <Popup.Title>{t('CardSettings.report.modal.title')}</Popup.Title>
      </Popup.Header>
      <Text use="p" variant="caption" color="grey-tone-50">
        {t('CardSettings.report.modal.text')}
      </Text>
      <Popup.Actions>
        <Button elevated onClick={onReportClick}>
          {t('CardSettings.report.modal.button')}
        </Button>
        <Button variant="secondary" elevated onClick={onRequestClose}>
          {t('common:cancel')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
