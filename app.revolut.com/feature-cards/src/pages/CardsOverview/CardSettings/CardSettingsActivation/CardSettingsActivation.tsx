import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Item } from '@revolut/ui-kit'

import {
  CARDS_I18N_NAMESPACE,
  getCardDeliveryState,
  isLikelyDelivered,
} from '../../../../helpers'
import { useGetUserCard } from '../../../../hooks'

type CardSettingsActivationProps = {
  cardId: string
}

export const CardSettingsActivation: FC<CardSettingsActivationProps> = ({ cardId }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const { cardData } = useGetUserCard(cardId)

  if (!cardData) {
    return null
  }

  const deliveryState = getCardDeliveryState(cardData)

  if (!isLikelyDelivered(deliveryState)) {
    return null
  }

  return (
    <Item>
      <Item.Content>
        <Item.Title>{t('CardSettingsActivation.title')}</Item.Title>
        <Item.Description>{t('CardSettingsActivation.description')}</Item.Description>
      </Item.Content>
      <Item.Side>
        <Item.Value>
          <Icons.InfoOutline color="accent" size={16} />
        </Item.Value>
      </Item.Side>
    </Item>
  )
}
