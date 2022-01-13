/**
 * Converts to Intl locale format.
 */
export const normalizeLocale = (locale?: string) => locale?.replace('_', '-')
