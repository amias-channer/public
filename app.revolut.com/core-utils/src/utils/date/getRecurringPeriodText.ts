import { getI18n } from 'react-i18next'
import { RecurringPaymentPeriod } from '@revolut/rwa-core-types'

export const getRecurringPeriodText = (period: RecurringPaymentPeriod) => {
  const i18n = getI18n()
  switch (period) {
    case RecurringPaymentPeriod.Daily:
      return i18n.t('common:recurringPeriod.daily')
    case RecurringPaymentPeriod.Weekly:
      return i18n.t('common:recurringPeriod.weekly')
    case RecurringPaymentPeriod.Monthly:
      return i18n.t('common:recurringPeriod.monthly')
    default:
      return i18n.t('common:recurringPeriod.unknown')
  }
}
