import { useHistory, useParams } from 'react-router-dom'

import { StatementType, Currency, UUID } from '@revolut/rwa-core-types'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { getFirstDayOfDateMonth } from '@revolut/rwa-core-utils'
import { trackEvent, AccountTrackingEvent } from '@revolut/rwa-core-analytics'
import {
  StatementGenerator,
  QueryParamsFactoryArgs,
  StatementUrl,
} from '@revolut/rwa-feature-statements'
import { useGetFirstUserTransaction } from '@revolut/rwa-feature-transactions'

import { useGetPocketFromWalletById } from '../Account/hooks'

const queryParamsFactory = (currency: Currency) => (params: QueryParamsFactoryArgs) => {
  return {
    from: params.dateFrom,
    to: params.dateTo,
    ccy: currency,
    format: params.format,
    type: StatementType.Official,
  }
}

export const AccountStatement = () => {
  const history = useHistory()
  const { id: pocketId } = useParams<{ id?: UUID }>()

  const { user } = useAuthContext()
  const pocket = useGetPocketFromWalletById(pocketId)
  const firstUserTransaction = useGetFirstUserTransaction(pocketId)

  const handleBackButtonClick = () => {
    history.goBack()
  }

  const currency = pocket?.currency ?? ''

  const calendarFromDate = getFirstDayOfDateMonth(
    new Date(firstUserTransaction?.createdDate || user?.createdDate || Date.now()),
  )

  return (
    <StatementGenerator
      statementFetchUrl={StatementUrl.AccountStatementUrl}
      currency={currency}
      availableDatesRange={{
        from: calendarFromDate,
        to: new Date(),
      }}
      isCSVAvailable
      onBackButtonClick={handleBackButtonClick}
      queryParamsFactory={queryParamsFactory(currency)}
      onDownload={() => {
        trackEvent(AccountTrackingEvent.statementDownloaded, { currency })
      }}
      onError={() => {
        trackEvent(AccountTrackingEvent.statementGenerationfailed, { currency })
      }}
    />
  )
}
