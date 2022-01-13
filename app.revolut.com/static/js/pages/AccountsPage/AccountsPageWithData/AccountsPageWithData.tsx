import { FC, useEffect, useState } from 'react'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { useQueryWallet } from '@revolut/rwa-core-api'

import { AccountsPage } from '../AccountsPage'
import { getWalletBaseCurrency } from './helpers'

export const AccountsPageWithData: FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)

  const { user } = useAuthContext()
  const { data: wallet } = useQueryWallet()

  useEffect(() => {
    if (!wallet) {
      return
    }

    const walletBaseCurrency = getWalletBaseCurrency(wallet)

    setSelectedCurrency(walletBaseCurrency)
  }, [wallet])

  return (
    <AccountsPage
      user={user}
      wallet={wallet}
      selectedCurrency={selectedCurrency}
      setSelectedCurrency={setSelectedCurrency}
    />
  )
}
