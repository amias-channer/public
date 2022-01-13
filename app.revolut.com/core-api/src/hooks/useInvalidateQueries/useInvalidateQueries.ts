import { useCallback } from 'react'
import { useQueryClient, QueryKey } from 'react-query'

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient()

  return useCallback(
    async (...queryKeys: QueryKey[]) => {
      await Promise.all(
        queryKeys.map((queryKey) => queryClient.invalidateQueries(queryKey)),
      )
    },
    [queryClient],
  )
}
