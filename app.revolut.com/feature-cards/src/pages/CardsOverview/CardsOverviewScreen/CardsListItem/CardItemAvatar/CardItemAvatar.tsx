import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Avatar, Color } from '@revolut/ui-kit'

import { CardItemDto } from '@revolut/rwa-core-types'
import { CardImage } from './CardImage'

type CardItemAvatarProps = {
  cardData: CardItemDto
  color?: Color
  Icon?: Icons.IconComponentType
}

export const CardItemAvatar: FC<CardItemAvatarProps> = ({ cardData, color, Icon }) => (
  <Avatar color="white">
    <CardImage brand={cardData.brand} design={cardData.design} />
    {Icon && color && <Avatar.Badge bg={color} useIcon={Icon} />}
  </Avatar>
)
