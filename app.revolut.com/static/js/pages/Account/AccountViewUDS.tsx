import { FC, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Layout, ThemeProvider, UnifiedTheme, HeaderSkeleton } from '@revolut/ui-kit'

import { useQueryUserConfig } from '@revolut/rwa-core-api'
import { AccountDetailsTab } from '@revolut/rwa-core-components'
import {
  Pocket,
  RevolutBankAccount,
  User,
  UserCompany,
  UUID,
  Wallet,
} from '@revolut/rwa-core-types'
import {
  getAccountDetailsForPocket,
  isRestrictedAccessToken,
  Url,
} from '@revolut/rwa-core-utils'

import { AccountHeaderUDS } from './AccountHeader'
import { getPocketFromWalletById } from './helpers'

type AccountViewProps = {
  accountApiCallStatus: string
  accounts: RevolutBankAccount[]
  user?: User
  userCompany?: UserCompany
  userCompanyApiCallStatus: string
  wallet?: Wallet
  walletApiCallStatus: string
}

export const AccountView: FC<AccountViewProps> = ({
  accountApiCallStatus,
  accounts,
  user,
  userCompany,
  userCompanyApiCallStatus,
  wallet,
  walletApiCallStatus,
}) => {
  const { id: pocketId } = useParams<{ id?: UUID }>()

  const selectedPocket: Pocket | undefined = useMemo(
    () => getPocketFromWalletById(wallet, pocketId),
    [pocketId, wallet],
  )

  const accountDetailsRelatedToPocket = useMemo(
    () => getAccountDetailsForPocket(selectedPocket, accounts),
    [accounts, selectedPocket],
  )

  const isLoading =
    userCompanyApiCallStatus !== 'success' ||
    walletApiCallStatus !== 'success' ||
    (!isRestrictedAccessToken() && accountApiCallStatus !== 'success')

  const history = useHistory()

  const handleBackButtonClick = () => {
    history.push(Url.Home)
  }

  const [userConfig] = useQueryUserConfig()

  return (
    <ThemeProvider theme={UnifiedTheme}>
      <Layout>
        <Layout.Main>
          {isLoading ? (
            <HeaderSkeleton variant="item" labelBackButton="Back" />
          ) : (
            <>
              {selectedPocket && (
                <AccountHeaderUDS
                  pocket={selectedPocket}
                  onBackButtonClick={handleBackButtonClick}
                />
              )}
              {user && userCompany && selectedPocket && userConfig && (
                <AccountDetailsTab
                  user={user}
                  userConfig={userConfig}
                  userCompany={userCompany}
                  accountDetails={accountDetailsRelatedToPocket}
                  selectedPocket={selectedPocket}
                />
              )}
            </>
          )}
        </Layout.Main>
      </Layout>
    </ThemeProvider>
  )
}
