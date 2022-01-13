import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import { Group, Subheader } from '@revolut/ui-kit'

import { CardItemDto } from '@revolut/rwa-core-types'

import {
  CARDS_I18N_NAMESPACE,
  isCardPaymentPending,
  isDisposableCard,
  isVirtualCard,
} from '../../../../helpers'
import { useUpdateCardSettings } from './hooks'
import { OtherSecurityItem } from './OtherSecurityItem'

type OtherSecuritySettingsProps = {
  cardData: CardItemDto
}

export const getOtherSecurityItemTitleKey = (element: string) =>
  `CardSettings.other.${element}.title`

export const getOtherSecurityItemDescriptionKey = (element: string) =>
  `CardSettings.other.${element}.text`

export enum OtherSecurityItemName {
  OnlineTransactions = 'transactions',
  ATMWithdrawals = 'atm',
  LocationSecurity = 'geoSecurity',
  SwipePayments = 'swipe',
}

export const otherSecurityItemsApiNames = {
  [OtherSecurityItemName.OnlineTransactions]: 'ecommerceDisabled',
  [OtherSecurityItemName.ATMWithdrawals]: 'atmWithdrawalsDisabled',
  [OtherSecurityItemName.LocationSecurity]: 'locationSecurityEnabled',
  [OtherSecurityItemName.SwipePayments]: 'magstripeDisabled',
}

export const OtherSecuritySettings: FC<OtherSecuritySettingsProps> = ({ cardData }) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)
  const currentSettingsRef = useRef(cardData.settings)
  const { updateCardSettings } = useUpdateCardSettings()

  const isCardPaymentDone = !isCardPaymentPending(cardData)
  const isSettingsOtherAvailable =
    !isDisposableCard(cardData) && !isVirtualCard(cardData) && isCardPaymentDone

  if (!isSettingsOtherAvailable) {
    return null
  }

  const handleSecurityItemChange = (
    securityItemName: OtherSecurityItemName,
    state: boolean,
  ) => {
    const apiName = otherSecurityItemsApiNames[securityItemName]

    currentSettingsRef.current = {
      ...currentSettingsRef.current,
      [apiName]: state,
    }

    updateCardSettings({
      cardId: cardData.id,
      updatedSettings: currentSettingsRef.current,
    })
  }

  const handleOnlineTransactionsStateChange = (checked: boolean) => {
    handleSecurityItemChange(OtherSecurityItemName.OnlineTransactions, !checked)
  }

  const handleAtmWithdrawalsStateChange = (checked: boolean) => {
    handleSecurityItemChange(OtherSecurityItemName.ATMWithdrawals, !checked)
  }

  const handleLocationSecurityStateChange = (checked: boolean) => {
    handleSecurityItemChange(OtherSecurityItemName.LocationSecurity, checked)
  }

  const handleSwipePaymentsStateChange = (checked: boolean) => {
    handleSecurityItemChange(OtherSecurityItemName.SwipePayments, !checked)
  }

  const securityItems = [
    {
      Icon: Icons.Globe,
      name: OtherSecurityItemName.OnlineTransactions,
      onChange: handleOnlineTransactionsStateChange,
    },
    {
      Icon: Icons.Cash,
      name: OtherSecurityItemName.ATMWithdrawals,
      onChange: handleAtmWithdrawalsStateChange,
    },
    {
      Icon: Icons.LocationPin,
      name: OtherSecurityItemName.LocationSecurity,
      defaultChecked: currentSettingsRef.current.locationSecurityEnabled,
      onChange: handleLocationSecurityStateChange,
    },
    {
      Icon: Icons.Card,
      name: OtherSecurityItemName.SwipePayments,
      onChange: handleSwipePaymentsStateChange,
    },
  ]

  return (
    <>
      <Subheader>
        <Subheader.Title>{t('CardSettings.other.title')}</Subheader.Title>
      </Subheader>

      <Group>
        {securityItems.map((securityItem) => (
          <OtherSecurityItem
            key={securityItem.name}
            Icon={securityItem.Icon}
            title={t(getOtherSecurityItemTitleKey(securityItem.name))}
            description={t(getOtherSecurityItemDescriptionKey(securityItem.name))}
            defaultChecked={
              securityItem.defaultChecked ??
              !currentSettingsRef.current[otherSecurityItemsApiNames[securityItem.name]]
            }
            onChange={securityItem.onChange}
          />
        ))}
      </Group>
    </>
  )
}
