import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Header, Popup, Text } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

type UnblockPinCvvPopupProps = {
  isUnblocking: boolean
  onSubmit: VoidFunction
} & BaseModalProps

export const UnblockPinCvvPopup: FC<UnblockPinCvvPopupProps> = ({
  isOpen,
  isUnblocking,
  onSubmit,
  onRequestClose,
}) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])

  return (
    <Popup isOpen={isOpen} onExit={onRequestClose} variant="bottom-sheet">
      <Header variant="bottom-sheet">
        <Header.Title>{t('CardSettings.UnblockPinCvvPopup.title')}</Header.Title>
      </Header>
      <Text use="p" variant="caption" color="grey-tone-50">
        {t('CardSettings.UnblockPinCvvPopup.text')}
      </Text>
      <Popup.Actions>
        <Button
          elevated
          pending={isUnblocking}
          disabled={isUnblocking}
          onClick={onSubmit}
        >
          {t('CardSettings.UnblockPinCvvPopup.button')}
        </Button>
        <Button disabled={isUnblocking} variant="secondary" onClick={onRequestClose}>
          {t('common:cancel')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
