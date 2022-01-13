import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BreakpointsProvider } from '@revolut/ui-kit'

import { AbsoluteLoader } from '@revolut/rwa-core-components'
import { User, Wallet } from '@revolut/rwa-core-types'
import { Url } from '@revolut/rwa-core-utils'

import { PageWithSidebarLayout } from 'components/Layouts/PageWithSidebarLayout'
import { TabsLayout } from 'components/Layouts/TabsLayout'

import { AccountsHeader } from './AccountsHeader'
import { getPocketsConvertedForDisplayFromWallet } from './AccountsPageWithData/helpers'
import { AccountsTab } from './AccountsTab'
import { I18N_NAMESPACE } from './constants'
import { ShopperBannerContainer } from './ShopperBanner'
import { TransactionsTab } from './TransactionsTab'

type AccountsPageProps = {
  user?: User
  wallet?: Wallet
  selectedCurrency: string | null
  setSelectedCurrency: (currency: string) => void
}

/**
 * @deprecated
 */
export const AccountsPage: FC<AccountsPageProps> = ({
  user,
  wallet,
  setSelectedCurrency,
  selectedCurrency,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const accountsPageTabs = [
    {
      name: 'accounts',
      text: t('Tabs.accounts'),
      route: { pathname: Url.Accounts },
    },
    {
      name: 'transactions',
      text: t('Tabs.allTransactions'),
      route: { pathname: Url.AccountsTransactions },
    },
  ]

  const pockets = useMemo(
    () => (wallet ? getPocketsConvertedForDisplayFromWallet(wallet) : null),
    [wallet],
  )

  const screens = {
    accounts: () =>
      pockets && pockets.length ? <AccountsTab pockets={pockets} /> : null,
    transactions: () =>
      user ? <TransactionsTab user={user} isFromStartOfAccountActivity /> : null,
  }

  const header = (
    <AccountsHeader
      wallet={wallet}
      currency={selectedCurrency}
      setSelectedCurrency={setSelectedCurrency}
      banner={<ShopperBannerContainer />}
    />
  )

  return (
    <BreakpointsProvider>
      <PageWithSidebarLayout>
        {!pockets ? (
          <AbsoluteLoader data-testid="accounts-page-loader" />
        ) : (
          <TabsLayout header={header} tabs={accountsPageTabs} screens={screens} />
        )}
      </PageWithSidebarLayout>
    </BreakpointsProvider>
  )
}
