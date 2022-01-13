import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCreateBankAddress, UserConfigMap } from '@revolut/rwa-core-api'
import {
  Pocket,
  RevolutBankAccount,
  User,
  UserCompany,
  UserKycStatus,
} from '@revolut/rwa-core-types'

import { EmptyStateCard } from '../../EmptyStateCard'
import { AccountDetailsWithHints } from '../AccountDetailsWithHints'
import { AccountDetailsWithHintsVariant } from '../constants'

type AccountDetailsTabProps = {
  accountDetails: RevolutBankAccount[]
  user: User
  userConfig: UserConfigMap
  userCompany: UserCompany
  selectedPocket: Pocket
  variant?: AccountDetailsWithHintsVariant
}

export const AccountDetailsTab: FC<AccountDetailsTabProps> = ({
  accountDetails,
  user,
  userConfig,
  userCompany,
  selectedPocket,
  variant,
}) => {
  const { t } = useTranslation('pages.Account')
  const [creationRequestSent, setCreationRequestSent] = useState(false)

  const { createBankAddress } = useCreateBankAddress()

  const isPocketAvailableForTopUpByBankTransfer =
    userConfig.topupBankTransferCurrencies.includes(selectedPocket.currency)

  useEffect(() => {
    const notActivatedAccountDetails = accountDetails.find(
      (account: RevolutBankAccount) => account.activate,
    )

    const isKycRequirementPassed =
      notActivatedAccountDetails?.kycRequired || user.kyc === UserKycStatus.Passed

    if (notActivatedAccountDetails && isKycRequirementPassed && !creationRequestSent) {
      createBankAddress(selectedPocket.currency)
      setCreationRequestSent(true)
    }
  }, [createBankAddress, accountDetails, selectedPocket, user, creationRequestSent])

  const isUserOfAustralianCompanyAndNonAudAccount =
    userCompany.region === 'AU' && selectedPocket.currency !== 'AUD'
  const isComingSoon =
    !isPocketAvailableForTopUpByBankTransfer || isUserOfAustralianCompanyAndNonAudAccount

  if (isComingSoon) {
    return <EmptyStateCard outlined title={t('AccountDetailsTab.comingSoon')} />
  }

  return (
    <AccountDetailsWithHints
      accountDetails={accountDetails}
      userCompany={userCompany}
      variant={variant}
    />
  )
}
