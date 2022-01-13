import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Header, Popup, Text } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

type CardTerminationPopupProps = {
  isTerminating: boolean
  onSubmit: VoidFunction
} & BaseModalProps

export const CardTerminationPopup: FC<CardTerminationPopupProps> = ({
  isOpen,
  isTerminating,
  onRequestClose,
  onSubmit,
}) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])

  return (
    <Popup isOpen={isOpen} onExit={onRequestClose} variant="bottom-sheet">
      <Header variant="bottom-sheet">
        <Header.Title>{t('CardSettings.CardTerminationPopup.title')}</Header.Title>
      </Header>
      <Text use="p" variant="caption" color="grey-tone-50">
        {t('CardSettings.CardTerminationPopup.text')}
      </Text>
      <Popup.Actions>
        <Flex justifyContent="space-between">
          <Button variant="secondary" disabled={isTerminating} onClick={onRequestClose}>
            {t('common:cancel')}
          </Button>
          <Button
            ml="s-16"
            variant="primary"
            elevated
            pending={isTerminating}
            disabled={isTerminating}
            onClick={onSubmit}
          >
            {t('common:confirm')}
          </Button>
        </Flex>
      </Popup.Actions>
    </Popup>
  )
}
