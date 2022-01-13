import { noop } from 'lodash'
import qs from 'qs'
import { FC, useContext, useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router'
import { Box } from '@revolut/ui-kit'

import { trackEvent, TransactionTrackingEvent } from '@revolut/rwa-core-analytics'
import { Spacer, GoogleMapPointer } from '@revolut/rwa-core-components'
import { TransactionDto } from '@revolut/rwa-core-types'
import {
  browser,
  checkRequired,
  getAccountsTransactionsUrl,
  getAccountTransactionsUrl,
} from '@revolut/rwa-core-utils'
import {
  transactionPropertyChecker,
  TransactionsScrollingContext,
} from '@revolut/rwa-feature-transactions'
import { useQueryTransactionById } from '@revolut/rwa-core-api'

import { PageLayout } from 'components'
import { Header } from 'pages/AccountsPage/Header'

import { CardTerminatedScreen } from './CardTerminatedScreen'
import { SuspiciousHandler } from './SuspicousHandler'
import { TransactionConfirmedScreen } from './TransactionConfirmedScreen'
import { TransactionDetailsGeneral } from './TransactionDetailsGeneral'
import { TransactionDetailsHeader } from './TransactionDetailsHeader'

type UrlParams = {
  transactionId: string
}

type UrlQueryParams = {
  legId?: string
  accountId?: string
}

enum DetailsScreenSource {
  Pocket = 'POCKET',
  AllTransactions = 'AllTransactions',
}

const queryTransactionSingleEntity = (
  transaction?: TransactionDto[],
  legId?: string,
): TransactionDto | undefined => {
  if (!transaction) {
    return undefined
  }
  return legId ? transaction.find((entity) => entity.legId === legId) : transaction[0]
}

enum TransactionScreen {
  Details,
  TransactionConfirmed,
  CardTerminated,
}

export const TransactionDetails: FC = () => {
  const { transactionId } = useParams<UrlParams>()
  const history = useHistory()

  const [currentScreen, setCurrentScreen] = useState<TransactionScreen>(
    TransactionScreen.Details,
  )

  const { legId, accountId } = qs.parse(browser.getSearch()) as UrlQueryParams
  const { data, isLoading } = useQueryTransactionById(transactionId)

  const transactionData = queryTransactionSingleEntity(data, legId as string)

  const { shouldAutoScrollToTransactionBeUsed } = useContext(TransactionsScrollingContext)

  const handleBackButton = () => {
    if (!shouldAutoScrollToTransactionBeUsed) {
      history.goBack()
      return
    }

    const backUrl = accountId
      ? getAccountTransactionsUrl(accountId, legId)
      : getAccountsTransactionsUrl(legId)
    history.push(backUrl)
  }

  const onTransactionConfirmedHandler = () => {
    setCurrentScreen(TransactionScreen.TransactionConfirmed)
  }

  const onCardTerminatedHandler = () => {
    setCurrentScreen(TransactionScreen.CardTerminated)
  }

  useEffect(() => {
    if (currentScreen !== TransactionScreen.Details || !transactionData) {
      return noop
    }

    trackEvent(TransactionTrackingEvent.detailsOpened, {
      transactionId,
      transactionLegId: transactionData.legId,
      state: transactionData.state,
      source: accountId
        ? DetailsScreenSource.Pocket
        : DetailsScreenSource.AllTransactions,
    })

    return () => {
      trackEvent(TransactionTrackingEvent.detailsClosed, {
        transactionId,
        transactionLegId: transactionData.legId,
      })
    }
  }, [accountId, currentScreen, transactionData, transactionId])

  switch (currentScreen) {
    case TransactionScreen.TransactionConfirmed: {
      const cardLast4 = checkRequired(
        transactionData?.card?.lastFour,
        'No card last 4 numbers',
      )
      return <TransactionConfirmedScreen cardLast4={cardLast4} />
    }

    case TransactionScreen.CardTerminated:
      return <CardTerminatedScreen />
    case TransactionScreen.Details:
    default:
      return (
        <PageLayout isLoading={isLoading} onBackButtonClick={handleBackButton}>
          <Box maxWidth={{ md: 'pages.TransactionDetails.maxWidth.md' }}>
            <Header
              info={
                <Box>
                  {transactionData ? (
                    <TransactionDetailsHeader transaction={transactionData} />
                  ) : (
                    <Spacer h="7.6rem" />
                  )}
                </Box>
              }
            />
            {transactionData && (
              <>
                {transactionPropertyChecker.isSuspicious(transactionData) && (
                  <Box mt="px16">
                    <SuspiciousHandler
                      transactionId={transactionData.id}
                      onConfirmed={onTransactionConfirmedHandler}
                      onCardTerminated={onCardTerminatedHandler}
                    />
                  </Box>
                )}
                {transactionData.merchant?.address && (
                  <Box mt="px24">
                    <GoogleMapPointer address={transactionData.merchant?.address} />
                  </Box>
                )}
                <Box mt="px24">
                  <TransactionDetailsGeneral transaction={transactionData} />
                </Box>
              </>
            )}
          </Box>
        </PageLayout>
      )
  }
}
