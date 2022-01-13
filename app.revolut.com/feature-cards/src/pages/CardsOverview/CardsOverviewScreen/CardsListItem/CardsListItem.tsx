import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Item } from '@revolut/ui-kit'

import { CardItemDto } from '@revolut/rwa-core-types'
import { getCardDetailsUrl } from '@revolut/rwa-core-utils'

import { useGetUserCard } from '../../../../hooks'
import { useGetCardTitle } from '../../hooks'
import { addLastFourToCardLabel } from '../../utils'
import { CardItemAvatar } from './CardItemAvatar'
import { CardListItemDescription } from './CardListItemDescription'
import { useGetCardStateContent } from './hooks'

type CardsListItemProps = {
  cardData: CardItemDto
}

enum CardsListItemTestId {
  ItemContent = 'card-list-item-content-test-id',
}

export const CardsListItem: FC<CardsListItemProps> = ({ cardData }) => {
  const history = useHistory()

  const cardId = cardData.id

  useGetUserCard(cardId)

  const cardTitle = useGetCardTitle(cardData)
  const cardStateContent = useGetCardStateContent(cardData)

  return (
    <Item use="button" onClick={() => history.push(getCardDetailsUrl(cardId))}>
      <Item.Avatar>
        <CardItemAvatar
          cardData={cardData}
          color={cardStateContent?.color}
          Icon={cardStateContent?.Icon}
        />
      </Item.Avatar>

      <Item.Content data-testid={CardsListItemTestId.ItemContent}>
        <Item.Title>{addLastFourToCardLabel(cardTitle, cardData.lastFour)}</Item.Title>
        <Item.Description>
          <CardListItemDescription
            cardData={cardData}
            cardStateLabel={cardStateContent?.label}
            textColor={cardStateContent?.color}
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )
}
