import { useCallback } from 'react'
import { useQueryClient, useMutation } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { terminateCard } from '../../../../../api'

export const useTerminateCard = () => {
  const { mutate, isLoading } = useMutation(terminateCard)
  const queryClient = useQueryClient()

  const handleCardTermination = useCallback(
    async (
      cardId: string,
      { onSuccess, onError }: { onSuccess: VoidFunction; onError: VoidFunction },
    ) => {
      await mutate(cardId, {
        onSuccess: async () => {
          queryClient.removeQueries(QueryKey.Cards)
          queryClient.removeQueries(QueryKey.Wallet)
          queryClient.removeQueries([QueryKey.UserCard, cardId])

          onSuccess()
        },
        onError,
      })
    },
    [mutate, queryClient],
  )

  return {
    terminateCard: handleCardTermination,
    isCardTerminationInProgress: isLoading,
  }
}
