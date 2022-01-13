import isNil from 'lodash/isNil'
import { FC, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Layout } from '@revolut/ui-kit'

import { TopUpTrackingEvent, trackEvent } from '@revolut/rwa-core-analytics'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { UserConfigMap, useQueryUserConfig } from '@revolut/rwa-core-api'
import { FullPageLoader } from '@revolut/rwa-core-components'
import {
  Pocket,
  RevolutBankAccount,
  User,
  UserCompany,
  UUID,
  WalletDto,
} from '@revolut/rwa-core-types'
import { getAccountDetailsForPocket, I18nNamespace } from '@revolut/rwa-core-utils'

import { I18N_NAMESPACE, TopUpMethod } from '../constants'
import { TopUpContext } from '../TopUpProvider'
import { useQueryAccounts, useQueryUserCompany, useQueryWallet } from './hooks'
import { ScreenHeader } from './ScreenHeader'

const getPocketFromWalletById = (wallet?: WalletDto, pocketId?: UUID) => {
  return wallet?.pockets?.find((pocket) => pocket.id === pocketId) as Pocket | undefined
}

type TopUpViaBankTransferScreenProps = {
  renderAccountDetails: (
    user: User,
    userConfig: UserConfigMap,
    userCompany: UserCompany,
    selectedPocket: Pocket,
    accountDetails: RevolutBankAccount[],
  ) => JSX.Element
  submitButtonText?: string
  onGoBack: VoidFunction
  onAction: VoidFunction
}

export const TopUpViaBankTransferScreen: FC<TopUpViaBankTransferScreenProps> = ({
  renderAccountDetails,
  submitButtonText,
  onGoBack,
  onAction,
}) => {
  const { t } = useTranslation([I18N_NAMESPACE, I18nNamespace.Domain])
  const { user } = useAuthContext()
  const { pocketId } = useContext(TopUpContext)

  const [userConfig] = useQueryUserConfig()
  const { data: accountsData, status: accountsQueryStatus } = useQueryAccounts()
  const { data: userCompanyData, status: userCompanyQueryStatus } = useQueryUserCompany()
  const { data: walletData, status: walletQueryStatus } = useQueryWallet()

  const selectedPocket = getPocketFromWalletById(walletData, pocketId)

  const isFetching = [
    accountsQueryStatus,
    userCompanyQueryStatus,
    walletQueryStatus,
  ].includes('loading')

  useEffect(() => {
    // As it is a special top up method (navigates to the separate screen right after
    // the selection) we need to duplicate the tracking logic here.
    trackEvent(TopUpTrackingEvent.topUpMethodSelected, {
      method: TopUpMethod.RegularBankTransfer,
    })
  }, [])

  if (
    isFetching ||
    isNil(user) ||
    isNil(userConfig) ||
    isNil(selectedPocket) ||
    isNil(userCompanyData)
  ) {
    return <FullPageLoader />
  }

  return (
    <Layout>
      <Layout.Main>
        <ScreenHeader onGoBack={onGoBack} />

        {renderAccountDetails(
          user,
          userConfig,
          userCompanyData,
          selectedPocket,
          getAccountDetailsForPocket(selectedPocket, accountsData),
        )}

        <Layout.Actions>
          <Button onClick={onAction}>
            {submitButtonText ?? t('TopUpViaBankTransferScreen.getTheAppButtonText')}
          </Button>
        </Layout.Actions>
      </Layout.Main>
    </Layout>
  )
}
