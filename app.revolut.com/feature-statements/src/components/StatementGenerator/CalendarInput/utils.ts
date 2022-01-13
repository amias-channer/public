import { getCurrentLocale, normalizeLocale } from '@revolut/rwa-core-utils'

export const formatDateValue = (date: Date) =>
  date.toLocaleString(normalizeLocale(getCurrentLocale()), {
    month: 'long',
    year: 'numeric',
  })
