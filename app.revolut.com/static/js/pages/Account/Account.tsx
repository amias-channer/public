import { FC } from 'react'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { useQueryWallet } from '@revolut/rwa-core-api'

import { AccountView } from './AccountViewUDS'
import { useQueryAccounts, useQueryUserCompany } from './hooks'

export const Account: FC = () => {
  const { user } = useAuthContext()
  const { data: accounts, status: accountApiCallStatus } = useQueryAccounts()
  const { data: wallet, status: walletApiCallStatus } = useQueryWallet()

  const { data: userCompany, status: userCompanyApiCallStatus } = useQueryUserCompany()

  return (
    <AccountView
      wallet={wallet}
      user={user}
      userCompany={userCompany}
      userCompanyApiCallStatus={userCompanyApiCallStatus}
      accounts={accounts}
      walletApiCallStatus={walletApiCallStatus}
      accountApiCallStatus={accountApiCallStatus}
    />
  )
}
