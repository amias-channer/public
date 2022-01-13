import { FC } from 'react'
import { Avatar, Item, Image } from '@revolut/ui-kit'

import { CardItemDto } from '@revolut/rwa-core-types'

import { getCardsListItemDesignImage } from '../../../../../helpers'
import { useGetCardTitle } from '../../../hooks'
import { addLastFourToCardLabel } from '../../../utils'

type CardItemProps = {
  cardData: CardItemDto
}

export const CardItem: FC<CardItemProps> = ({ cardData }) => {
  const cardTitle = useGetCardTitle(cardData)

  return (
    <Item>
      <Item.Avatar>
        <Avatar color="white">
          <Image
            borderRadius="2px"
            src={getCardsListItemDesignImage(cardData.brand, cardData.design)}
          />
        </Avatar>
      </Item.Avatar>

      <Item.Content>
        <Item.Title>
          {addLastFourToCardLabel(cardData.brand.toUpperCase(), cardData.lastFour)}
        </Item.Title>
        <Item.Description>{cardTitle}</Item.Description>
      </Item.Content>
    </Item>
  )
}
