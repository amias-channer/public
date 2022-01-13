import { useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'

import {
  checkRequired,
  QueryKey,
  Url,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { useGetPendingCardPayment } from 'hooks'

import { useCancelCardCheckout } from '../../../../hooks'

export const useReplaceCurrentCardOrder = () => {
  const queryClient = useQueryClient()
  const history = useHistory()
  const navigateToErrorPage = useNavigateToErrorPage()

  const { cancelCardCheckout } = useCancelCardCheckout()
  const { pendingCardPayment } = useGetPendingCardPayment()

  const goToCardOrdering = useCallback(() => {
    history.push(Url.CardOrdering)
  }, [history])

  return useCallback(async () => {
    await cancelCardCheckout(
      checkRequired(pendingCardPayment?.card.id, 'Card ID can not be empty'),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(QueryKey.Cards)
          queryClient.invalidateQueries(QueryKey.PendingCheckouts)
          goToCardOrdering()
        },
        onError: () => {
          navigateToErrorPage('Card checkout can not be cancelled')
        },
      },
    )
  }, [
    cancelCardCheckout,
    goToCardOrdering,
    navigateToErrorPage,
    pendingCardPayment?.card.id,
    queryClient,
  ])
}
