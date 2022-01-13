import { FC } from 'react'
import { ProductWidget, ItemSkeleton } from '@revolut/ui-kit'

import { useGetUserCards } from '@revolut/rwa-core-api'
import { checkRequired } from '@revolut/rwa-core-utils'

import { CardsOverviewHeader } from '../components'
import { CardsGroups } from './CardsGroups'

export const CardsOverviewScreen: FC = () => {
  const { cards, isFetching: isCardsFetching } = useGetUserCards()

  return (
    <ProductWidget>
      <CardsOverviewHeader />

      {isCardsFetching ? (
        <ItemSkeleton />
      ) : (
        <CardsGroups cards={checkRequired(cards, '"cards" data is required')} />
      )}
    </ProductWidget>
  )
}
