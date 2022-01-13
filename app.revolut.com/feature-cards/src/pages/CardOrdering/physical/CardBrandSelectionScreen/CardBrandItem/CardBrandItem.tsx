import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { CardBrand } from '@revolut/rwa-core-types'

const CARD_BRAND_ICON: Record<CardBrand, Icons.IconComponentType> = {
  [CardBrand.Maestro]: Icons.LogoMa,
  [CardBrand.Mastercard]: Icons.LogoMc,
  [CardBrand.Visa]: Icons.LogoVisa,
}

type CardBrandItemProps = {
  title: string
  description?: string
  cardBrand?: CardBrand
  onClick: (cardBrand?: CardBrand) => void
}

export const CardBrandItem: FC<CardBrandItemProps> = ({
  title,
  description,
  cardBrand,
  onClick,
}) => {
  const handleItemClick = () => {
    onClick(cardBrand)
  }

  return (
    <Item use="button" variant="disclosure" onClick={handleItemClick}>
      <Item.Avatar>
        <Avatar useIcon={cardBrand ? CARD_BRAND_ICON[cardBrand] : Icons.Card} />
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{title}</Item.Title>

        {description && <Item.Description>{description}</Item.Description>}
      </Item.Content>
    </Item>
  )
}
