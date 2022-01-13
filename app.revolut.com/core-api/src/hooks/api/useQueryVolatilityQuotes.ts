import { isEmpty } from 'lodash'
import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'
import { Currency } from '@revolut/rwa-core-config'

import { getVolatilityQuotes } from '../../api'

export const useQueryVolatilityQuotes = (
  currencies: string[],
  refetchInterval: number = 1000,
) => {
  const { data, status } = useQuery(
    [QueryKey.VolatilityQuotes, currencies],
    () => getVolatilityQuotes(currencies),
    { refetchInterval, enabled: !isEmpty(currencies) },
  )

  const getVolatilityObject = (from: Currency, to: Currency) => {
    if (isEmpty(data)) {
      return undefined
    }

    return data?.find((rate) => rate.from === from && rate.to === to)
  }

  return { data, status, getVolatilityObject }
}
