import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getAllCards } from '../../api'

export const useGetAllCards = () => {
  const { data, isFetching } = useQuery(QueryKey.Cards, getAllCards, {
    refetchOnWindowFocus: false,
  })

  return { cards: data, isFetching }
}
