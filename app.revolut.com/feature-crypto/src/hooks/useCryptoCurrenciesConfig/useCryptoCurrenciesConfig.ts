import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'

import { fetchCryptoCurrenciesConfig } from '../../api'

export const useCryptoCurrenciesConfig = () =>
  useQuery(QueryKey.CryptoCurrenciesConfig, () => fetchCryptoCurrenciesConfig())
