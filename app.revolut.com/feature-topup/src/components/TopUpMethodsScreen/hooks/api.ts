import { useMutation, useQuery } from 'react-query'

import { getUserCompany } from '@revolut/rwa-core-api'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getUserTopupCards, removeExternalCard } from '../../../api'

export const useQueryUserTopupCards = () => {
  const { data, status } = useQuery(QueryKey.UserTopupCards, getUserTopupCards)

  return {
    data: data?.data,
    status,
  }
}

export const useQueryUserCompany = () => {
  const { data, status } = useQuery(QueryKey.UserCompany, getUserCompany, {
    staleTime: Infinity,
  })
  const userCompany = data?.data

  return {
    data: userCompany,
    status,
  }
}

export const useRemoveExternalCard = () => {
  const { mutate, isLoading } = useMutation(removeExternalCard)

  return { removeExternalCard: mutate, isRemovingExternalCard: isLoading }
}
