import { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Carousel, Flex } from '@revolut/ui-kit'

import { useGetUserCards } from '@revolut/rwa-core-api'
import { CardItemDto } from '@revolut/rwa-core-types'
import { getCardDetailsUrl } from '@revolut/rwa-core-utils'

import { Card, CARD_WIDTH } from '../../Card'

type CardsCarouselProps = {
  selectedCardId: string
}

const getCardIndexById = (cards: CardItemDto[], cardId: string) =>
  cards.findIndex((card) => card.id === cardId)

export const CardsCarousel: FC<CardsCarouselProps> = ({ selectedCardId }) => {
  const history = useHistory()

  const { cards } = useGetUserCards()

  if (!cards) {
    return null
  }

  const selectedCardIndex = getCardIndexById(cards, selectedCardId)

  const handleCardChange = (index: number) => {
    if (index === selectedCardIndex) {
      return
    }

    history.push(getCardDetailsUrl(cards[index].id))
  }

  return (
    <Carousel
      align="center"
      defaultIndex={selectedCardIndex}
      alignWidth={`${CARD_WIDTH}px`}
      onIndexChange={handleCardChange}
    >
      {cards.map((card) => (
        <Carousel.Item key={card.id} width={1}>
          <Flex py="16px" justifyContent="center">
            <Card cardId={card.id} />
          </Flex>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
