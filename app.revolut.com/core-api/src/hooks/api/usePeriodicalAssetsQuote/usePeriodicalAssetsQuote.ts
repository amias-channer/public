import { useQuery } from 'react-query'

import { checkRequired, QueryKey } from '@revolut/rwa-core-utils'

import { getAssetsQuote } from '../../../api'
import { AssetsQuoteArgs } from '../../../api/retail/quote'

export const REFETCH_INTERVAL = 3_000 // as defined in https://bitbucket.org/revolut/revolut-android/src/a6027cef103a54ade57ecadeb51dbd814d91cd0e/app_retail/feature_market_data_impl/src/main/java/com/revolut/feature_market_data_impl/data/repositories/OrderQuoteRepositoryImpl.kt#lines-51

export const getRefetchInterval = (assetsQuoteParams?: AssetsQuoteArgs) =>
  Boolean(assetsQuoteParams?.amount) &&
  parseFloat(assetsQuoteParams!.amount) !== 0 &&
  REFETCH_INTERVAL

export const usePeriodicalAssetsQuote = (
  assetsQuoteParams?: AssetsQuoteArgs,
  locale?: string,
  options?: { enabled: boolean },
) => {
  const isCurrenciesDifferent =
    Boolean(assetsQuoteParams) &&
    assetsQuoteParams?.fromSymbol !== assetsQuoteParams?.toSymbol

  const enabled = options?.enabled ?? true

  const { data, isFetching, isError } = useQuery(
    [QueryKey.AssetsQuote, assetsQuoteParams],
    () => getAssetsQuote(checkRequired(assetsQuoteParams), locale),
    {
      enabled: isCurrenciesDifferent && enabled,
      cacheTime: 0,
      staleTime: 0,
      refetchInterval: getRefetchInterval(assetsQuoteParams),
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
      keepPreviousData: isCurrenciesDifferent,
    },
  )

  return {
    assetsQuote: data,
    isAssetsQuoteFetching: isFetching,
    isAssetsQuoteError: isError,
  }
}
