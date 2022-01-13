import { FC } from 'react'
import { StatusPopup } from '@revolut/ui-kit'

import { useCardsTranslation } from '../../../../../hooks'
import { VirtualCardType } from '../../constants'

type VirtualCardsSuccessOrderPopupProps = {
  isOpen: boolean
  type: VirtualCardType
  onRequestClose: VoidFunction
}

export const VirtualCardsSuccessOrderPopup: FC<VirtualCardsSuccessOrderPopupProps> = ({
  isOpen,
  type,
  onRequestClose,
}) => {
  const t = useCardsTranslation()

  return (
    <StatusPopup variant="success" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>
        {t(`CardOrdering.VirtualCardsSuccessOrderPopup.title.${type}`)}
      </StatusPopup.Title>
    </StatusPopup>
  )
}
