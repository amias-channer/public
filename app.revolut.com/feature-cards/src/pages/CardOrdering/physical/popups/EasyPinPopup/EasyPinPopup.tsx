import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Popup, Text } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

type EasyPinPopupProps = {
  onChangeClick: VoidFunction
  onContinueClick: VoidFunction
} & BaseModalProps

export const EasyPinPopup: FC<EasyPinPopupProps> = ({
  isOpen,
  onChangeClick,
  onContinueClick,
  onRequestClose,
}) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])

  const handleChangePinClick = () => {
    onRequestClose()
    onChangeClick()
  }

  const handleContinueClick = () => {
    onRequestClose()
    onContinueClick()
  }

  return (
    <Popup
      variant="bottom-sheet"
      isOpen={isOpen}
      focusTrap={false}
      onExit={onRequestClose}
    >
      <Popup.Header>
        <Popup.Title>{t('CardOrdering.EasyPinPopup.title')}</Popup.Title>
      </Popup.Header>
      <Text use="p" variant="caption" color="grey-tone-50">
        {t('CardOrdering.EasyPinPopup.text')}
      </Text>
      <Popup.Actions>
        <Button elevated onClick={handleChangePinClick}>
          {t('CardOrdering.EasyPinPopup.changeButton')}
        </Button>
        <Button variant="secondary" elevated onClick={handleContinueClick}>
          {t('common:continue')}
        </Button>
      </Popup.Actions>
    </Popup>
  )
}
