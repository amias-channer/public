import { useTranslation } from 'react-i18next'

import { I18nNamespace } from '@revolut/rwa-core-utils'

export const useCommonTranslation = () => {
  const { t } = useTranslation(I18nNamespace.Common)

  return t
}
