import { isNil } from 'lodash'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card as CardIcon } from '@revolut/icons'
import { Flex, Box } from '@revolut/ui-kit'

import { useGetUserCards } from '@revolut/rwa-core-api'
import { Link } from '@revolut/rwa-core-components'
import { TransactionCardDto, CardItemDto } from '@revolut/rwa-core-types'
import { getCardDetailsUrl } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE } from '../constants'

type Props = {
  card: TransactionCardDto
}

const findUserCard = (cardId: string, userCards: CardItemDto[]) =>
  userCards.find((card) => card.id === cardId)

export const TransactionCard: FC<Props> = ({ card }) => {
  const { t } = useTranslation(I18N_NAMESPACE)
  const { cards } = useGetUserCards()

  const isUserCardExist = !isNil(findUserCard(card.id, cards || []))

  const shownCardData = (
    <Flex>
      <Box mr="px14">
        <CardIcon />
      </Box>
      <Box>
        {card?.label} •• {card?.lastFour}
      </Box>
    </Flex>
  )

  return (
    <Flex justifyContent="space-between" mt="px16" data-cy="link-to-card">
      <Box color="transactionDetailPropName">{t('properties.card')}</Box>
      <Box>
        {isUserCardExist ? (
          <Link to={getCardDetailsUrl(card.id)}>{shownCardData}</Link>
        ) : (
          <Box>{shownCardData}</Box>
        )}
      </Box>
    </Flex>
  )
}
