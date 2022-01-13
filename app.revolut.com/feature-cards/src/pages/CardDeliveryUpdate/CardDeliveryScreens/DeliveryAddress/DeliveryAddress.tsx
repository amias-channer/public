import { FC } from 'react'

import { FullPageLoader } from '@revolut/rwa-core-components'
import { AddressDto } from '@revolut/rwa-core-types'

import { DeliveryAddressForm, DeliveryAddressFormProps } from './DeliveryAddressForm'

type DeliveryAddressProps = {
  isLoading: boolean
  address?: AddressDto
} & Omit<DeliveryAddressFormProps, 'address'>

export const DeliveryAddress: FC<DeliveryAddressProps> = ({
  address,
  isLoading,
  ...rest
}) => {
  if (isLoading || !address) {
    return <FullPageLoader />
  }

  return <DeliveryAddressForm address={address} {...rest} />
}
