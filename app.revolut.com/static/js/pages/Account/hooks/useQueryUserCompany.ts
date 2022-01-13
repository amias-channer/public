import { useQuery } from 'react-query'

import { getUserCompany } from '@revolut/rwa-core-api'
import { UserCompany } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

export const useQueryUserCompany = () => {
  const { data, status } = useQuery(QueryKey.UserCompany, getUserCompany, {
    staleTime: Infinity,
  })
  const userCompany: UserCompany | undefined = data?.data

  return {
    data: userCompany,
    status,
  }
}
