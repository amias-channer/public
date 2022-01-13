import { FC, useCallback } from 'react'
import { ActionWidget, Button, ButtonSkeleton, Skeleton } from '@revolut/ui-kit'

import { AddressFormValues, useModal } from '@revolut/rwa-core-components'
import { AddressDto } from '@revolut/rwa-core-types'
import { COUNTRIES } from '@revolut/rwa-core-utils'
import { useCountryTranslations } from '@revolut/rwa-core-i18n'

import { useCardsTranslation } from '../../../../../hooks'
import { DeliveryAddressFormPopup } from '../DeliveryAddressFormPopup'

type DeliveryAddressWidgetProps = {
  address?: AddressDto
  onSaveAddress: (address: AddressDto) => void
}

export enum DeliveryAddressWidgetTestId {
  DeliveryAddressWidgetSkeleton = 'delivery-address-widget-skeleton',
}

export const DeliveryAddressWidget: FC<DeliveryAddressWidgetProps> = ({
  address,
  onSaveAddress,
}) => {
  const t = useCardsTranslation()

  const [showAddressFormPopup, addressFormPopupProps] = useModal()
  const getCountryTranslation = useCountryTranslations()

  const handleSaveAddress = useCallback(
    (addressFormValues: AddressFormValues) => {
      onSaveAddress({
        country: addressFormValues.country,
        city: addressFormValues.city,
        postcode: addressFormValues.postCode,
        streetLine1: addressFormValues.addressLine1,
        streetLine2: addressFormValues.addressLine2,
        region: addressFormValues.region,
      })
    },
    [onSaveAddress],
  )

  if (!address) {
    return (
      <ActionWidget
        data-testid={DeliveryAddressWidgetTestId.DeliveryAddressWidgetSkeleton}
      >
        <ActionWidget.Content>
          <Skeleton width="160px" height="16px" />
        </ActionWidget.Content>
        <ActionWidget.Actions>
          <ButtonSkeleton width="128px" mt="s-56" />
        </ActionWidget.Actions>
      </ActionWidget>
    )
  }

  const { streetLine1, streetLine2, postcode, city, country } = address

  return (
    <>
      <ActionWidget>
        <ActionWidget.Content>
          {streetLine1}
          <br />
          {streetLine2}
          {streetLine2 && <br />}
          {postcode}
          {postcode && <br />}
          {city}
          <br />
          {getCountryTranslation({
            countryCode: country,
            countryName: COUNTRIES[country].name,
          })}
        </ActionWidget.Content>
        <ActionWidget.Actions>
          <Button size="sm" variant="secondary" onClick={showAddressFormPopup}>
            {t('CardOrdering.DeliveryAddressScreen.DeliveryAddressWidget.button')}
          </Button>
        </ActionWidget.Actions>
      </ActionWidget>
      <DeliveryAddressFormPopup
        {...addressFormPopupProps}
        address={address}
        onSubmit={handleSaveAddress}
      />
    </>
  )
}
