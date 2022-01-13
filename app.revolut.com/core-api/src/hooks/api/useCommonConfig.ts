import { useQuery } from 'react-query'

import { CommonConfigResponseDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getCommonConfig } from '../../api'

export type CommonConfigMap = {
  addressSearchCountries: string[]
  blacklistedCountries: string[]
  countriesWithoutZip: string[]
  postcodeSearchCountries: string[]
  supportedCountries: string[]
  signInLockoutMinutes: number
  signInMaxAttempts: number
}

const configMapper = (configData: CommonConfigResponseDto): CommonConfigMap => ({
  addressSearchCountries: configData['address.search.fulltext.countries'],
  blacklistedCountries: configData['countries.blacklisted'],
  countriesWithoutZip: configData['countries.without-zip'],
  postcodeSearchCountries: configData['address.search.postcode.countries'],
  supportedCountries: configData['countries.supported'],
  signInLockoutMinutes: configData['security.signin.lockout_minutes'],
  signInMaxAttempts: configData['security.signin.max_attempts'],
})

export const useCommonConfig = (): [CommonConfigMap | undefined, boolean] => {
  const { data, isFetching } = useQuery(QueryKey.CommonConfig, getCommonConfig, {
    staleTime: Infinity,
  })

  return [data ? configMapper(data) : undefined, isFetching]
}
