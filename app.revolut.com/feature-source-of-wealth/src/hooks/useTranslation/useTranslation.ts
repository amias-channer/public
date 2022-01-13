import { StringMap, TOptions } from 'i18next'
import { useTranslation as useI18n } from 'react-i18next'

import { I18N_VERIFICATIONS_NAMESPACE, I18nNamespace } from '../../utils'

export const useTranslation = (namespace: I18nNamespace) => {
  const { t } = useI18n(I18N_VERIFICATIONS_NAMESPACE)

  const handleTranslation = (key: string, restOptions?: string | TOptions<StringMap>) => {
    return t(`${namespace}.${key}`, restOptions)
  }

  return {
    t: handleTranslation,
  }
}
