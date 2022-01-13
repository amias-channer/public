import pick from 'lodash/pick'
import sortBy from 'lodash/sortBy'
import values from 'lodash/values'

import { COUNTRIES } from '@revolut/rwa-core-utils'

import { GetCountryTranslation } from '../hooks'

type SupportedCountryOption = {
  label: string
  value: string
}

type GetFormattedSupportedCountriesArgs = {
  supportedCountries?: string[]
  getCountryTranslation: GetCountryTranslation
}

export const getFormattedSupportedCountries = ({
  supportedCountries,
  getCountryTranslation,
}: GetFormattedSupportedCountriesArgs) =>
  sortBy(
    values(
      supportedCountries ? pick(COUNTRIES, supportedCountries) : COUNTRIES,
    ).map<SupportedCountryOption>((item) => ({
      label: getCountryTranslation({
        countryCode: item.id,
        countryName: item.name,
      }),
      value: item.id,
    })),
    'label',
  )
