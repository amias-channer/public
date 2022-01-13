import qs from 'qs'
import { FC, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, ProductWidget, ProductWidgetSkeleton } from '@revolut/ui-kit'

import { useQueryWallet, useQueryQuotes } from '@revolut/rwa-core-api'
import { TransactionDto } from '@revolut/rwa-core-types'
import { browser, getHomeUrl } from '@revolut/rwa-core-utils'
import { LatestTransactions } from '@revolut/rwa-feature-transactions'

import {
  getPocketsConvertedForDisplayFromWallet,
  getTotalBalance,
  getWalletBaseCurrency,
} from 'pages/AccountsPage/AccountsPageWithData/helpers'
import { useGetCurrenciesForQuotesRequest } from 'pages/AccountsPage/AccountsPageWithData/hooks'

import { ALL_ACCOUNTS_ID } from '../../constants'
import { AccountsPopup } from '../AccountsPopup'
import { Suggestions } from '../Suggestions'
import { Header } from './Header'
import { getCurrency, getPocketId, getSelectedPocket } from './helpers'

export type AccountsPopupState = 'closed' | 'open'

type UrlQueryParams = {
  accountId?: string
}

export const HomeProductWidget: FC = () => {
  const { accountId } = qs.parse(browser.getSearch()) as UrlQueryParams
  const [selectedAccountId, setSelectedAccountId] = useState<string>()
  const [isSuggestedForYouVisible, setIsSuggestedForYouVisible] = useState(true)

  const { data: wallet, status: walletQueryStatus } = useQueryWallet()
  const history = useHistory()

  useEffect(() => {
    if (!wallet) {
      return
    }

    if (accountId) {
      if (accountId === ALL_ACCOUNTS_ID) {
        setSelectedAccountId(ALL_ACCOUNTS_ID)
        return
      }

      const initialAccount = wallet.pockets.find((pocket) => pocket.id === accountId)

      if (initialAccount) {
        setSelectedAccountId(initialAccount.id)
        return
      }
    }

    const walletBaseCurrency = getWalletBaseCurrency(wallet)

    const accountOfBaseCurrency = wallet.pockets.find(
      (pocket) => pocket.currency === walletBaseCurrency,
    )

    setSelectedAccountId(
      accountOfBaseCurrency ? accountOfBaseCurrency.id : ALL_ACCOUNTS_ID,
    )
  }, [accountId, wallet])

  const [accountsPopupState, setAccountsPopupState] =
    useState<AccountsPopupState>('closed')

  const handleAccountClick = (pocketId: string) => {
    history.push(getHomeUrl({ tab: 'accounts', queryParams: { accountId: pocketId } }))
    setSelectedAccountId(pocketId)
  }

  const selectedPocket = useMemo(
    () => getSelectedPocket(wallet, selectedAccountId),
    [wallet, selectedAccountId],
  )

  const pocketId = useMemo(
    () => getPocketId(selectedAccountId, selectedPocket),
    [selectedAccountId, selectedPocket],
  )

  const currency = getCurrency(wallet, selectedPocket, selectedAccountId)
  const currenciesForQuotesRequest = useGetCurrenciesForQuotesRequest(
    wallet ? wallet.baseCurrency : null,
    wallet,
  )
  const { data: quotes } = useQueryQuotes(currenciesForQuotesRequest)

  const totalBalance = useMemo(() => {
    return wallet && currency
      ? getTotalBalance(wallet, quotes, wallet.baseCurrency, currenciesForQuotesRequest)
      : undefined
  }, [currency, quotes, wallet, currenciesForQuotesRequest])

  const baseCurrency = wallet ? wallet.baseCurrency : null

  const pockets = useMemo(
    () => (wallet ? getPocketsConvertedForDisplayFromWallet(wallet) : null),
    [wallet],
  )

  const accounts = pockets || []

  const isWalletDataLoaded = walletQueryStatus === 'success'

  const onTransactionClick = (txn: TransactionDto) => {
    history.push(
      getHomeUrl({
        tab: 'accounts',
        queryParams: {
          accountId: selectedAccountId,
          transactionId: txn.id,
          transactionLegId: txn.legId,
        },
      }),
    )
  }

  return (
    <>
      {isWalletDataLoaded ? (
        <>
          <ProductWidget backgroundColor="white" data-testid="homeWidget">
            <Header
              selectedAccountId={selectedAccountId}
              currency={currency}
              totalBalance={totalBalance}
              setAccountsPopupState={setAccountsPopupState}
              accounts={accounts}
            />
            <LatestTransactions
              accountId={selectedAccountId === ALL_ACCOUNTS_ID ? undefined : pocketId}
              onTransactionClick={onTransactionClick}
              amountToShow={isSuggestedForYouVisible ? 3 : 5}
            />
          </ProductWidget>

          <Suggestions onClose={() => setIsSuggestedForYouVisible(false)} />
        </>
      ) : (
        <ProductWidgetSkeleton data-testid="homeWidgetSkeleton" />
      )}

      <Box mb="s-16" />

      {baseCurrency && (
        <AccountsPopup
          accounts={accounts}
          isOpen={Boolean(accountsPopupState !== 'closed' && selectedAccountId)}
          onExit={() => setAccountsPopupState('closed')}
          baseCurrency={baseCurrency}
          totalBalance={totalBalance}
          selectedAccountId={selectedAccountId}
          onAccountClick={handleAccountClick}
        />
      )}
    </>
  )
}
