import { RecurringPaymentCrypto, StandingOrderType } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import { useRecurringPayments } from '../useRecurringPayments'

export const useCryptoRecurringPayments = () => {
  const { recurringPaymentsData, isRecurringPaymentsFetched } = useRecurringPayments()

  if (!isRecurringPaymentsFetched) {
    return {
      isLoading: true,
      items: [],
    }
  }

  const paymentsInfo = checkRequired(
    recurringPaymentsData,
    'Recurring payments data should not be empty',
  )

  return {
    isLoading: false,
    items: paymentsInfo.recurringPayments.filter(
      (recurringPayment) => recurringPayment.type === StandingOrderType.Crypto,
    ) as unknown as RecurringPaymentCrypto[],
  }
}
