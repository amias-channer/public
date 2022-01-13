import { useQuery } from 'react-query'

import { QueryKey } from '@revolut/rwa-core-utils'
import {
  InstrumentMostOwnedResponseDto,
  InstrumentMostOwnedKey,
} from '@revolut/rwa-core-types'

import { getInstrumentsMostOwned } from '../../api'

const getMostOwnedInstruments = (
  data: InstrumentMostOwnedResponseDto[],
  key: InstrumentMostOwnedKey,
) => data.find((item) => item.key === key)?.instruments

export const usePopularAssets = (assetType: InstrumentMostOwnedKey) => {
  const { data: instrumentsMostOwned, isSuccess } = useQuery(
    QueryKey.InstrumentsMostOwned,
    () => getInstrumentsMostOwned(),
  )

  const assets = getMostOwnedInstruments(instrumentsMostOwned ?? [], assetType) ?? []

  return { assets, isSuccess }
}
