import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { getRecurringPayments } from '../../../../api'

export const useRecurringPayments = () => {
  const { data, isFetching, isSuccess } = useQuery(
    QueryKey.RecurringPayments,
    getRecurringPayments,
    {
      staleTime: Infinity,
    },
  )

  return {
    recurringPaymentsData: data,
    isRecurringPaymentsFetching: isFetching,
    isRecurringPaymentsFetched: isSuccess,
  }
}
