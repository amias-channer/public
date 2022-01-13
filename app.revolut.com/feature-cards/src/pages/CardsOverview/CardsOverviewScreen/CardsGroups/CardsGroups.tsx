import isEmpty from 'lodash/isEmpty'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { CardItemDto } from '@revolut/rwa-core-types'

import { CARDS_I18N_NAMESPACE } from '../../../../helpers'
import { groupPhysicalAndVirtualCards } from '../../utils'
import { CardsList } from '../CardsList'

type CardsGroupsProps = {
  cards: CardItemDto[]
}

export const CardsGroups: FC<CardsGroupsProps> = ({ cards }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)

  const { physicalCards, virtualCards } = groupPhysicalAndVirtualCards(cards)

  return (
    <>
      {!isEmpty(physicalCards) && (
        <CardsList
          title={t('CardsOverview.groupTitle.physicalCards')}
          cards={physicalCards}
        />
      )}

      {!isEmpty(virtualCards) && (
        <CardsList
          title={t('CardsOverview.groupTitle.virtualCards')}
          cards={virtualCards}
        />
      )}
    </>
  )
}
