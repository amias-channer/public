import { useMemo } from 'react'

import { CheckoutType } from '@revolut/rwa-core-types'

import { useGetPendingCheckouts } from '../useGetPendingCheckouts'

export const useGetPendingCardPayment = (isEnabled: boolean) => {
  const { pendingCheckouts, isPendingCheckoutsFetching } =
    useGetPendingCheckouts(isEnabled)

  const pendingCardPayment = useMemo(
    () => pendingCheckouts?.find((checkout) => checkout.type === CheckoutType.Card),
    [pendingCheckouts],
  )

  return {
    pendingCardPayment,
    isPendingCheckoutsFetching,
  }
}
