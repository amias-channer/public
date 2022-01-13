import { useQuery } from 'react-query'

import { InstrumentAssetType, TopMoversTimeSpan } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getInstrumentTopMovers } from '../../api'

type UseGetInstrumentTopMoversOptions = {
  assetType: InstrumentAssetType
  timeSpan?: TopMoversTimeSpan
}

export const useGetInstrumentTopMovers = ({
  assetType,
  timeSpan,
}: UseGetInstrumentTopMoversOptions) => {
  const { data, isSuccess } = useQuery(
    [QueryKey.InstrumentTopMovers, assetType, timeSpan],
    () => getInstrumentTopMovers({ assetType, timeSpan }),
  )

  return { topMoversData: data, isSuccess }
}
