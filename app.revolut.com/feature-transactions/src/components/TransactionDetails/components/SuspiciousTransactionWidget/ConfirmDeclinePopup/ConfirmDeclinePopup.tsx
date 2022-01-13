import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Popup, Header, Text, Button } from '@revolut/ui-kit'

import { I18nNamespace } from '@revolut/rwa-core-utils'

type Props = {
  isOpen: boolean
  onExit: () => void
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
}

export const ConfirmDeclinePopup: FC<Props> = ({
  isOpen,
  onExit,
  onConfirm,
  onCancel,
  title,
  description,
}) => {
  const { t } = useTranslation(I18nNamespace.Common)
  return (
    <Popup isOpen={isOpen} onExit={onExit} variant="bottom-sheet">
      <Header variant="bottom-sheet">
        <Header.Title>{title}</Header.Title>
      </Header>
      <Text use="p" variant="caption" color="grey-tone-50">
        {description}
      </Text>
      <Popup.Actions>
        <Button elevated onClick={onConfirm}>
          {t('confirm')}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
