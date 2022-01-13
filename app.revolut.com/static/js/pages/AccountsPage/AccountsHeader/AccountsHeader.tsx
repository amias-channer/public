import { uniq, compact, isNil } from 'lodash'
import { FC, useMemo, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Box, H1, Text } from '@revolut/ui-kit'

import { ActionButton, Spacer, Balance } from '@revolut/rwa-core-components'
import { Wallet } from '@revolut/rwa-core-types'
import { Url } from '@revolut/rwa-core-utils'
import { useQueryQuotes } from '@revolut/rwa-core-api'

import { getTotalBalance, getWalletBaseCurrency } from '../AccountsPageWithData/helpers'
import { useGetCurrenciesForQuotesRequest } from '../AccountsPageWithData/hooks'
import { I18N_NAMESPACE } from '../constants'
import { Header } from '../Header'
import { BASE_CURRENCIES } from './constants'
import { CurrencySelect } from './CurrencySelect'

type AccountsHeaderProps = {
  wallet?: Wallet
  currency: string | null
  setSelectedCurrency: (currency: string) => void
  banner?: ReactElement
}

export const AccountsHeader: FC<AccountsHeaderProps> = ({
  wallet,
  currency,
  setSelectedCurrency,
  banner,
}) => {
  const history = useHistory()
  const { t } = useTranslation(I18N_NAMESPACE)
  const currenciesForQuotesRequest = useGetCurrenciesForQuotesRequest(currency, wallet)
  const { data: quotes } = useQueryQuotes(currenciesForQuotesRequest)

  const balance = useMemo(() => {
    return wallet && currency
      ? getTotalBalance(wallet, quotes, currency, currenciesForQuotesRequest)
      : null
  }, [currency, quotes, wallet, currenciesForQuotesRequest])

  const handleAddMoneyButtonClick = () => {
    history.push(Url.AccountsTopUp)
  }

  const walletBaseCurrency = wallet ? getWalletBaseCurrency(wallet) : null
  const currenciesList = useMemo(
    () => uniq([...BASE_CURRENCIES, ...compact([currency, walletBaseCurrency])]),
    [currency, walletBaseCurrency],
  )

  const selectedIndex = currency ? currenciesList.indexOf(currency) : 0
  const isBalanceAvailable =
    quotes &&
    currenciesForQuotesRequest &&
    (quotes.length || !currenciesForQuotesRequest.length)

  return (
    <Header
      pb={0}
      info={
        <div>
          {isBalanceAvailable && !isNil(balance) && currency ? (
            <H1 data-testid="accounts-total-balance">
              <Balance amount={balance} currency={currency} />
            </H1>
          ) : (
            <Box height="3.42rem" /> // To prevent from jumping
          )}

          {currency && selectedIndex !== -1 && (
            <Text mt="4px" color="grey-35">
              {t('Header.balanceDescription')}{' '}
              <Text color="primary" data-testid="accounts-currency-select">
                <CurrencySelect
                  {...{ currenciesList, selectedIndex, onChange: setSelectedCurrency }}
                />
              </Text>
            </Text>
          )}

          <Spacer h={{ _: 'px16', tablet: 'px24' }} />

          <ActionButton
            useIcon={Icons.Plus}
            buttonProps={{ onClick: handleAddMoneyButtonClick }}
          >
            {t('Header.addMoneyButtonText')}
          </ActionButton>

          {banner}
        </div>
      }
    />
  )
}
