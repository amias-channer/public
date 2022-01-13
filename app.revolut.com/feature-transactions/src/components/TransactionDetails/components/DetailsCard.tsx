import { isNil } from 'lodash'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card as CardIcon } from '@revolut/icons'
import { DetailsCell, Button } from '@revolut/ui-kit'

import { useGetAllCards } from '@revolut/rwa-core-api'
import { TransactionCardDto, CardItemDto } from '@revolut/rwa-core-types'
import { getCardDetailsUrl } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../constants'

type Props = {
  card: TransactionCardDto
}

const findUserCard = (cardId: string, userCards: CardItemDto[]) =>
  userCards.find((card) => card.id === cardId)

export const DetailsCard: FC<Props> = ({ card }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { cards } = useGetAllCards()

  const isUserCardExist = !isNil(findUserCard(card.id, cards || []))

  return (
    <DetailsCell>
      <DetailsCell.Title>{t('properties.card')}</DetailsCell.Title>
      <DetailsCell.Content>
        <Button
          size="sm"
          pr={0}
          variant="text"
          disabled={!isUserCardExist}
          useIcon={CardIcon}
          use="a"
          target="_self"
          href={getCardDetailsUrl(card.id)}
        >
          {card?.label} •• {card?.lastFour}
        </Button>
      </DetailsCell.Content>
    </DetailsCell>
  )
}
