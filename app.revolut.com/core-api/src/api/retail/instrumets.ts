import axios from 'axios'
import {
  InstrumentAssetType,
  InstrumentCollectionDto,
  InstrumentTopMoversResponseDto,
  InstrumentMostOwnedResponseDto,
  TopMoversTimeSpan,
  InstrumentCollectionAssetType,
} from '@revolut/rwa-core-types'

export const getInstrumentTopMovers = async ({
  assetType,
  timeSpan = TopMoversTimeSpan.OneDay,
}: {
  assetType: InstrumentAssetType
  timeSpan?: TopMoversTimeSpan
}) => {
  const { data } = await axios.get<InstrumentTopMoversResponseDto>(
    '/retail/instruments/top-movers',
    {
      params: {
        assetType,
        timeSpan,
      },
    },
  )
  return data
}

export const getInstrumentsMostOwned = async () => {
  const { data } = await axios.get<InstrumentMostOwnedResponseDto[]>(
    '/retail/instruments/collections/most-owned',
  )
  return data
}

export const getInstrumentCollections = async (
  assetType?: InstrumentCollectionAssetType,
) => {
  const { data } = await axios.get<InstrumentCollectionDto[]>(
    '/retail/instruments/collections',
    {
      params: {
        assetType,
      },
    },
  )

  return data
}
