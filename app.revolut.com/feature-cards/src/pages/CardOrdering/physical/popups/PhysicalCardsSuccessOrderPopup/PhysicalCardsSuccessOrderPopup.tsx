import { FC } from 'react'
import { StatusPopup } from '@revolut/ui-kit'

import { useCardsTranslation } from '../../../../../hooks'
import { getCardTierName } from './utils'

type PhysicalCardsSuccessOrderPopupProps = {
  isOpen: boolean
  tier: number
  onRequestClose: VoidFunction
}

export const PhysicalCardsSuccessOrderPopup: FC<PhysicalCardsSuccessOrderPopupProps> = ({
  isOpen,
  tier,
  onRequestClose,
}) => {
  const t = useCardsTranslation()
  const cardTierName = getCardTierName(tier).toLowerCase()

  return (
    <StatusPopup variant="success" isOpen={isOpen} onExit={onRequestClose}>
      <StatusPopup.Title>
        {t(`CardOrdering.PhysicalCardsSuccessOrderPopup.title.${cardTierName}`)}
      </StatusPopup.Title>

      <StatusPopup.Description>
        {t(`CardOrdering.PhysicalCardsSuccessOrderPopup.description.${cardTierName}`)}
      </StatusPopup.Description>
    </StatusPopup>
  )
}
