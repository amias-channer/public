import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Popup, Text } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

type CardLimitReachedPopupProps = {
  title: string
  text: string
} & BaseModalProps

export const CardLimitReachedPopup: FC<CardLimitReachedPopupProps> = ({
  isOpen,
  title,
  text,
  onRequestClose,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)

  return (
    <Popup variant="bottom-sheet" isOpen={isOpen} onExit={onRequestClose}>
      <Popup.Header>
        <Popup.Title>{title}</Popup.Title>
      </Popup.Header>
      <Text use="p" variant="caption" color="grey-tone-50">
        {text}
      </Text>
      <Popup.Actions>
        <Button elevated onClick={onRequestClose}>
          {t('common:got.it')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
