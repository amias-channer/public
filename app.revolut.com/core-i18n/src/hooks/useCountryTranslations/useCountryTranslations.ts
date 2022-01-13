import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { I18nNamespace } from '@revolut/rwa-core-utils'

export type GetCountryTranslation = ({
  countryCode,
  countryName,
}: {
  countryCode: string
  countryName: string
}) => string

export const useCountryTranslations = (): GetCountryTranslation => {
  const { t, i18n } = useTranslation(I18nNamespace.Common)

  return useCallback<GetCountryTranslation>(
    ({ countryCode, countryName }) => {
      const countryLocalisationKey = `${
        I18nNamespace.Common
      }:countries.${countryCode.toUpperCase()}`

      return i18n.exists(countryLocalisationKey) ? t(countryLocalisationKey) : countryName
    },
    [i18n, t],
  )
}
