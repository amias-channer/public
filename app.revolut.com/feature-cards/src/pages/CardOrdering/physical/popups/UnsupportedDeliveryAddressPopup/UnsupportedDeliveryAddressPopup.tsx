import { FC } from 'react'
import { Button, StatusPopup } from '@revolut/ui-kit'

import { BaseModalProps } from '@revolut/rwa-core-components'

import { useCardsTranslation } from '../../../../../hooks'

export const UnsupportedDeliveryAddressPopup: FC<BaseModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const t = useCardsTranslation()

  return (
    <StatusPopup variant="warning" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>
        {t('CardOrderingUnsupportedAddressPopup.title')}
      </StatusPopup.Title>
      <StatusPopup.Actions>
        <Button elevated onClick={onRequestClose}>
          {t('CardOrderingUnsupportedAddressPopup.button')}
        </Button>
      </StatusPopup.Actions>
    </StatusPopup>
  )
}
