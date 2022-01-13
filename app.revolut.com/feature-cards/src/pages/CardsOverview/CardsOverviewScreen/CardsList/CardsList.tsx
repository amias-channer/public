import { FC } from 'react'
import { chain, Subheader } from '@revolut/ui-kit'

import { CardItemDto } from '@revolut/rwa-core-types'

import { CardsListItem } from '../CardsListItem'

type CardsListProps = {
  title: string
  cards: CardItemDto[]
}

export const CardsList: FC<CardsListProps> = ({ title, cards }) => {
  return (
    <>
      <Subheader>
        <Subheader.Title>{chain(title, cards.length)}</Subheader.Title>
      </Subheader>

      {cards.map((card) => (
        <CardsListItem key={card.id} cardData={card} />
      ))}
    </>
  )
}
