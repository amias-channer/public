import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { Url } from '@revolut/rwa-core-utils'
import { CardItemDto } from '@revolut/rwa-core-types'

import { CARDS_I18N_NAMESPACE, isCardDesignJunior } from '../../../../../helpers'

type CardOtherSettingsActionProps = {
  cardData: CardItemDto
}

export const CardOtherSettingsAction: FC<CardOtherSettingsActionProps> = ({
  cardData,
}) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const history = useHistory()

  const isCardTerminationAvailable = !isCardDesignJunior(cardData)

  if (!isCardTerminationAvailable) {
    return null
  }

  return (
    <Item
      use="button"
      onClick={() =>
        history.push(generatePath(Url.CardSettingsOther, { cardId: cardData.id }))
      }
    >
      <Item.Avatar>
        <Avatar useIcon={Icons.Gear} />
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{t('CardSettings.otherSettings.title')}</Item.Title>
        <Item.Description>{t('CardSettings.otherSettings.description')}</Item.Description>
      </Item.Content>
    </Item>
  )
}
