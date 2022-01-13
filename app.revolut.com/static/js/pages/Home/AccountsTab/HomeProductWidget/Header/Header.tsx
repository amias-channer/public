import { TFunction } from 'i18next'
import { isNil, isEmpty } from 'lodash'
import { FC, Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import * as Icons from '@revolut/icons'
import { Avatar, ProductWidget, Button } from '@revolut/ui-kit'

import {
  PaymentsTrackingEvent,
  PaymentsTrackingEventParam,
  trackEvent,
} from '@revolut/rwa-core-analytics'
import { CountryFlag, useModal, Balance } from '@revolut/rwa-core-components'
import { FeatureKey } from '@revolut/rwa-core-config'
import {
  checkRequired,
  Url,
  getCountryByCurrency,
  I18nNamespace,
} from '@revolut/rwa-core-utils'

import { getPocketNameByCurrency } from 'pages/Account/AccountHeader/helpers'
import { PocketConvertedForDisplay } from 'pages/AccountsPage/types'
import { useFeaturesConfig } from 'hooks'

import { ALL_ACCOUNTS_ID } from '../../../constants'
import { AccountsPopupState } from '../HomeProductWidget'
import { MoreSettingsPopup } from '../../MoreSettingsPopup'

type HeaderProps = {
  selectedAccountId?: string
  currency: string | null
  totalBalance?: number
  setAccountsPopupState: Dispatch<SetStateAction<AccountsPopupState>>
  accounts: PocketConvertedForDisplay[]
}

const getSelectedAccountName = (
  t: TFunction,
  selectedAccountId?: string,
  selectedPocket?: PocketConvertedForDisplay,
) => {
  if (selectedAccountId === ALL_ACCOUNTS_ID) {
    return t('pages.Accounts:Header.allAccounts')
  }

  if (selectedPocket) {
    return getPocketNameByCurrency(t, selectedPocket.currency)
  }

  return ''
}

export const Header: FC<HeaderProps> = ({
  selectedAccountId,
  currency,
  totalBalance,
  setAccountsPopupState,
  accounts,
}) => {
  const { t } = useTranslation(['domain', 'pages.Accounts', I18nNamespace.Common])
  const { isFeatureActive } = useFeaturesConfig()
  const history = useHistory()
  const [showMoreSettingsPopup, moreSettingsPopupProps] = useModal()

  const country = getCountryByCurrency(currency)
  const selectedPocket = accounts.find(
    (pocket: PocketConvertedForDisplay) => pocket.id === selectedAccountId,
  )

  const getBalance = () => {
    if (selectedAccountId === ALL_ACCOUNTS_ID) {
      return totalBalance
    }

    if (!selectedPocket) {
      return null
    }

    return selectedPocket.amount
  }

  const balance = getBalance()
  const selectedAccountName = getSelectedAccountName(t, selectedAccountId, selectedPocket)

  const handleAddMoneyButtonClick = () => {
    history.push(Url.AccountsTopUp)
  }

  const handleSendMoneyButtonClick = () => {
    trackEvent(PaymentsTrackingEvent.homePageSendMoneyButtonClicked)

    history.push(Url.PaymentsWhoToPay, {
      pageSource: PaymentsTrackingEventParam.WhoToPayPageSource.HomeSend,
    })
  }

  const redirectToAccountDetails = () => {
    history.push(`/accounts/${selectedAccountId}/details`)
  }

  const navigateToAccountStatement = () => {
    history.push(
      generatePath(Url.AccountStatement, {
        id: checkRequired(selectedAccountId, 'selectedAccountId can not be empty'),
      }),
    )
  }

  const handleAccountDetailsButtonClick = () => {
    redirectToAccountDetails()
  }

  const handleFlagClick = () => {
    redirectToAccountDetails()
  }

  const handleProductWidgetTitleClick = () => {
    if (isEmpty(accounts)) {
      return
    }
    setAccountsPopupState('open')
  }

  const isPaymentAllowed = isFeatureActive(FeatureKey.AllowPayments)

  const shouldDisplayAccountDetails = selectedAccountId !== ALL_ACCOUNTS_ID

  const isAdditionalActionButtonsVisible =
    !isPaymentAllowed && shouldDisplayAccountDetails

  const isMoreButtonVisible = isPaymentAllowed && shouldDisplayAccountDetails

  return (
    <>
      <ProductWidget.Header>
        <ProductWidget.Avatar>
          {selectedAccountId === ALL_ACCOUNTS_ID || !selectedPocket || !country ? (
            <Avatar color="deep-grey" useIcon={Icons.Cash} />
          ) : (
            <CountryFlag
              color="deep-grey"
              size={40}
              country={country}
              onClick={handleFlagClick}
            />
          )}
        </ProductWidget.Avatar>

        <ProductWidget.Title
          onClick={handleProductWidgetTitleClick}
          data-testid="accountsSelectorButton"
        >
          {!isNil(balance) && currency && (
            <Balance amount={balance} currency={currency} />
          )}
        </ProductWidget.Title>

        <ProductWidget.Description>{selectedAccountName}</ProductWidget.Description>

        <ProductWidget.ActionBar>
          <Button
            useIcon={Icons.Plus}
            variant="secondary"
            size="sm"
            onClick={handleAddMoneyButtonClick}
          >
            {t('pages.Accounts:Header.addMoneyButtonText')}
          </Button>

          {isPaymentAllowed && (
            <Button
              useIcon={Icons.ArrowSend}
              variant="secondary"
              size="sm"
              onClick={handleSendMoneyButtonClick}
            >
              {t('pages.Accounts:Header.sendButtonText')}
            </Button>
          )}

          {isAdditionalActionButtonsVisible && (
            <Button
              useIcon={Icons.InfoOutline}
              variant="secondary"
              size="sm"
              onClick={handleAccountDetailsButtonClick}
            >
              {t('pages.Accounts:Header.accountDetails')}
            </Button>
          )}

          {isAdditionalActionButtonsVisible && (
            <Button
              useIcon={Icons.Statement}
              variant="secondary"
              size="sm"
              onClick={navigateToAccountStatement}
            >
              {t(`${I18nNamespace.Common}:statement`)}
            </Button>
          )}

          {isMoreButtonVisible && (
            <Button
              useIcon={Icons.MoreIOs}
              variant="secondary"
              size="sm"
              aria-label="More account settings"
              onClick={showMoreSettingsPopup}
            />
          )}
        </ProductWidget.ActionBar>
      </ProductWidget.Header>
      {isMoreButtonVisible && (
        <MoreSettingsPopup
          {...moreSettingsPopupProps}
          shouldDisplayDetails={shouldDisplayAccountDetails}
          onAccountDetailsClick={handleAccountDetailsButtonClick}
          onStatementClick={navigateToAccountStatement}
        />
      )}
    </>
  )
}
