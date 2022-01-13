import { useContext, useEffect, VFC } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { Box, useMatchBreakpoint } from '@revolut/ui-kit'
import { isNil } from 'lodash'

import { trackEvent, CryptoTrackingEvent } from '@revolut/rwa-core-analytics'
import { QueryKey, CryptoDetailsSourceOption, browser } from '@revolut/rwa-core-utils'
import { CryptoDetailsDto } from '@revolut/rwa-core-types'

import { fetchCryptoDetails } from '../../../../api'
import { CryptoContext } from '../../../../providers'
import { useCryptoHoldings } from '../../../../hooks'
import { CryptoFxLineChart } from '../../../../components'

import { CryptoAbout } from './CryptoAbout'
import { CryptoDetailsOverviewSkeleton } from './CryptoDetailsOverviewSkeleton'
import { CryptoHolding } from './CryptoHolding'
import { CryptoImportantNote } from './CryptoImportantNote'
import { CryptoStats } from './CryptoStats'

type UrlParams = {
  cryptoCode: string
}

type UrlQuery = {
  source: CryptoDetailsSourceOption
}

const getSourceAnalyticsParam = (sourcePageQuery: CryptoDetailsSourceOption) => {
  switch (sourcePageQuery) {
    case 'holdingsWidget':
      return 'Holdings'
    case 'holdingsPage':
      return 'HoldingsPage'
    case 'topMoversWidget':
      return 'TopMoversWidget'
    case 'topMoversPage':
      return 'TopMoversPage'
    case 'populaCryptoWidget':
      return 'PopularCryptoWidget'
    case 'populaCryptoPage':
      return 'PopularCryptoPage'
    case 'investPage':
      return 'InvestEntryPoint'
    case 'exchangeFlowCompleted':
      return 'ExchangeFlowCompleted'
    case 'exchangeFlowCanceled':
      return 'ExchangeFlowCanceled'
    default:
      return undefined
  }
}

export const CryptoDetailsOverview: VFC = () => {
  const { cryptoCode } = useParams<UrlParams>()
  const { source: sourcePageQuery } = browser.getQueryParams<UrlQuery>()

  const matches = useMatchBreakpoint('lg')

  const { data: cryptoDetails, status: cryptoDetailsQueryStatus } = useQuery(
    QueryKey.CryptoDetails,
    () => fetchCryptoDetails(cryptoCode),
  )

  const { targetCurrency } = useContext(CryptoContext)
  const { getHolding } = useCryptoHoldings(targetCurrency)

  const holdingData = getHolding(cryptoCode)

  const isLoaded =
    cryptoDetailsQueryStatus === 'success' &&
    !isNil(cryptoDetails) &&
    !holdingData.isLoading

  useEffect(() => {
    if (isLoaded) {
      trackEvent(CryptoTrackingEvent.assetDetailsOpened, {
        TICKER: cryptoCode,
        SOURCE: getSourceAnalyticsParam(sourcePageQuery),
      })
    }
  }, [sourcePageQuery, cryptoCode, isLoaded])

  if (!isLoaded) {
    return <CryptoDetailsOverviewSkeleton />
  }

  return (
    <Box mt="s-16">
      {!matches && (
        <Box mb="s-32">
          <CryptoFxLineChart
            baseCurrency={cryptoCode}
            targetCurrency={targetCurrency}
            chartHeight={300}
          />
        </Box>
      )}
      {holdingData.value && (
        <Box mb="s-32">
          <CryptoHolding
            cryptoHolding={holdingData.value}
            targetCurrency={targetCurrency}
          />
        </Box>
      )}
      <Box mb="s-32">
        <CryptoStats
          stats={cryptoDetails.stats}
          cryptoCode={cryptoCode}
          source={sourcePageQuery}
        />
      </Box>
      <Box mb="s-32">
        <CryptoAbout
          cryptoCode={cryptoCode}
          cryptoDetails={cryptoDetails as CryptoDetailsDto}
        />
      </Box>
      <Box mb="s-32">
        <CryptoImportantNote cryptoCode={cryptoCode} />
      </Box>
    </Box>
  )
}
