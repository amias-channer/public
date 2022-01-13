import isNil from 'lodash/isNil'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { Box, TabBar } from '@revolut/ui-kit'

import { RevolutBankAccount, UserCompany } from '@revolut/rwa-core-types'
import { checkRequired, I18nNamespace } from '@revolut/rwa-core-utils'

import { Spacer } from '../../Spacer'
import { AccountDetails } from '../AccountDetails'
import { AccountDetailsWithHintsVariant, BG_COLOR_BY_VARIANT } from '../constants'
import { AccountDetailsType } from '../types'
import { Hints } from './Hints'
import { TabLabel } from './TabLabel'
import { checkIfLocal, checkIfSwift, getDetails } from './utils'

const shouldShowSwiftBankDetails = (userCompany: UserCompany) =>
  userCompany.region !== 'JP'

type AccountDetailsWithHintsProps = {
  accountDetails: RevolutBankAccount[]
  userCompany: UserCompany
  variant?: AccountDetailsWithHintsVariant
}

export const AccountDetailsWithHints: FC<AccountDetailsWithHintsProps> = ({
  accountDetails,
  userCompany,
  variant = AccountDetailsWithHintsVariant.Light,
}) => {
  const { t } = useTranslation(I18nNamespace.Domain)

  const localAccountDetails = accountDetails.find(checkIfLocal)
  const swiftAccountDetails = shouldShowSwiftBankDetails(userCompany)
    ? accountDetails.find(checkIfSwift)
    : undefined

  const [activeTab, setActiveTab] = useState<AccountDetailsType>(
    localAccountDetails ? AccountDetailsType.Local : AccountDetailsType.Swift,
  )

  if (isNil(localAccountDetails) && isNil(swiftAccountDetails)) {
    return null
  }

  const activeAccountDetails = checkRequired(
    activeTab === AccountDetailsType.Local ? localAccountDetails : swiftAccountDetails,
    '"activeAccountDetails" can not be empty',
  )
  const tabs =
    !isNil(localAccountDetails) && !isNil(swiftAccountDetails)
      ? [AccountDetailsType.Local, AccountDetailsType.Swift]
      : undefined

  return (
    <Box>
      {tabs && (
        <MemoryRouter initialEntries={[activeTab]}>
          <TabBar mb="16px" variant="segmented">
            {tabs.map((tabType) => (
              <TabBar.Item
                key={tabType}
                to={tabType}
                onClick={() => setActiveTab(tabType)}
                data-testid={`details-type-tab-${tabType}`}
              >
                <TabLabel type={tabType} />
              </TabBar.Item>
            ))}
          </TabBar>
        </MemoryRouter>
      )}

      <AccountDetails
        bg={BG_COLOR_BY_VARIANT[variant]}
        tab={activeTab}
        details={getDetails(activeAccountDetails, userCompany, t)}
      />

      <Spacer h="16px" />

      <Hints accountDetails={activeAccountDetails} userCompany={userCompany} />
    </Box>
  )
}
