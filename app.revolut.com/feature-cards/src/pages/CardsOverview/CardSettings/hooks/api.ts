import { useQueryClient, useMutation, QueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'

import { CardItemDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { activateCard, deactivateCard, freezeCard, unfreezeCard } from '../../../../api'
import { getCardsOverviewUrl } from '../../../../helpers'

export const updateCardCacheData = (
  queryClient: QueryClient,
  data: CardItemDto,
  cardId: string,
) => {
  queryClient.setQueryData(QueryKey.Cards, (oldData?: CardItemDto[]) => {
    if (!oldData) {
      return []
    }

    return oldData.map((cardItem) => {
      if (cardItem.id === cardId) {
        return data
      }

      return cardItem
    })
  })

  queryClient.setQueryData([QueryKey.UserCard, cardId], (oldData?: CardItemDto) => ({
    ...data,
    image: oldData?.image,
  }))
}

export const useFreezeCard = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation<CardItemDto, unknown, string>(freezeCard, {
    onSuccess: (data, cardId) => updateCardCacheData(queryClient, data, cardId),
  })

  return { setFreezeCard: mutate, isLoading }
}

export const useUnfreezeCard = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation<CardItemDto, unknown, string>(unfreezeCard, {
    onSuccess: (data, cardId) => updateCardCacheData(queryClient, data, cardId),
  })

  return { setUnfreezeCard: mutate, isLoading }
}

export const useDeactivateCard = () => {
  const history = useHistory()
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation(deactivateCard, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(QueryKey.Cards)

      history.replace(getCardsOverviewUrl())
    },
  })

  return { deactivateCard: mutate, isLoading }
}

export const useActivateCard = () => {
  const { mutate, isLoading, data } = useMutation(activateCard)

  return {
    activateCard: mutate,
    isLoading,
    updatedCardData: data,
  }
}
