import { VFC } from 'react'
import { generatePath, useHistory, useParams } from 'react-router-dom'

import { StatementType, Currency } from '@revolut/rwa-core-types'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { getFirstDayOfDateMonth, Url } from '@revolut/rwa-core-utils'
import { CryptoTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import {
  StatementGenerator,
  QueryParamsFactoryArgs,
  StatementUrl,
} from '@revolut/rwa-feature-statements'

import { useGetCryptoPocketFromWallet } from './useGetCryptoPocketFromWallet'

const queryParamsFactory = (currency: Currency) => (params: QueryParamsFactoryArgs) => {
  return {
    from: params.dateFrom,
    to: params.dateTo,
    ccy: currency,
    format: params.format,
    type: StatementType.Official,
  }
}

export const CryptoStatement: VFC = () => {
  const history = useHistory()
  const { user } = useAuthContext()
  const { cryptoCode } = useParams<{ cryptoCode: string }>()

  const pocket = useGetCryptoPocketFromWallet(cryptoCode)

  const handleBackButtonClick = () => {
    history.push(
      generatePath(Url.CryptoDetailsOverview, {
        cryptoCode,
      }),
    )
  }

  const calendarFromDate = getFirstDayOfDateMonth(
    new Date(pocket?.createdDate || user?.createdDate || Date.now()),
  )

  return (
    <StatementGenerator
      statementFetchUrl={StatementUrl.AccountStatementUrl}
      currency={cryptoCode}
      availableDatesRange={{
        from: calendarFromDate,
        to: new Date(),
      }}
      isCSVAvailable
      onBackButtonClick={handleBackButtonClick}
      queryParamsFactory={queryParamsFactory(cryptoCode)}
      onDownload={() => {
        trackEvent(CryptoTrackingEvent.statementDownloaded, { cryptoCode })
      }}
      onError={() => {
        trackEvent(CryptoTrackingEvent.statementGenerationfailed, {
          cryptoCode,
        })
      }}
    />
  )
}
