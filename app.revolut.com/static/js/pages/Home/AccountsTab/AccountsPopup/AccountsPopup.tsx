import { isEmpty } from 'lodash'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Popup, Header, Group, Box } from '@revolut/ui-kit'

import { PocketConvertedForDisplay } from 'pages/AccountsPage/types'

import { I18N_NAMESPACE, ALL_ACCOUNTS_ID } from '../../constants'
import { AccountItem } from './AccountItem'
import { AllAccountsItem } from './AllAccountsItem'

type Props = {
  accounts: PocketConvertedForDisplay[]
  baseCurrency: string
  isOpen: boolean
  selectedAccountId?: string
  totalBalance?: number
  onExit: () => void
  onAccountClick: (accountId: string) => void
}

export const AccountsPopup: FC<Props> = ({
  accounts,
  isOpen,
  onExit,
  baseCurrency,
  totalBalance,
  selectedAccountId,
  onAccountClick,
}) => {
  const { t } = useTranslation(I18N_NAMESPACE)

  const handleAccountClick = (accountId: string) => () => {
    onExit()
    onAccountClick(accountId)
  }
  return (
    <Popup variant="bottom-sheet" isOpen={isOpen} onExit={onExit}>
      <Header variant="bottom-sheet">
        <Header.Title data-testid="homeWidgetPopupTitle">{t('accounts')}</Header.Title>
      </Header>
      <>
        <Group>
          <AllAccountsItem
            currency={baseCurrency}
            amount={totalBalance}
            selected={selectedAccountId === ALL_ACCOUNTS_ID}
            onClick={handleAccountClick(ALL_ACCOUNTS_ID)}
          />
        </Group>
        <Box mb="s-16" />
      </>

      <Group data-testid="accounts-popup-list">
        {isEmpty(accounts) ? null : (
          <>
            {accounts.map((account: PocketConvertedForDisplay) => (
              <AccountItem
                {...account}
                key={account.id}
                selected={selectedAccountId === account.id}
                onClick={handleAccountClick(account.id)}
              />
            ))}
          </>
        )}
      </Group>
    </Popup>
  )
}
