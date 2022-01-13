import isEmpty from 'lodash/isEmpty'
import { FC, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { useGetUserCards } from '@revolut/rwa-core-api'
import { AddressFormValues, useModal } from '@revolut/rwa-core-components'
import { DeliveryMethodDto } from '@revolut/rwa-core-types'
import { Url } from '@revolut/rwa-core-utils'

import { CardOrderingUnsupportedAddressModal } from '../../../components'
import { DeliveryAddress } from '../CardDeliveryScreens'
import { useGetCardDeliveryMethods } from '../hooks'

type DeliveryAddressScreenProps = {
  cardId: string
  onSubmit: (
    addressFormValues: AddressFormValues,
    availableDeliveryMethods: DeliveryMethodDto[],
  ) => void
}

export const DeliveryAddressScreen: FC<DeliveryAddressScreenProps> = ({
  cardId,
  onSubmit,
}) => {
  const history = useHistory()
  const { cards, isFetching } = useGetUserCards()
  const getCardDeliveryMethods = useGetCardDeliveryMethods()
  const [showUnsupportedAddressModal, unsupportedAddressModalProps] = useModal()

  const selectedCard = cards?.find((card) => card.id === cardId)

  const handleBackClick = () => {
    history.push(`${Url.Cards}/${cardId}`)
  }

  const handleSubmit = useCallback(
    async (addressValues: AddressFormValues) => {
      const { deliveryMethods } = await getCardDeliveryMethods({
        cardId,
        country: addressValues.country,
        postcode: addressValues.postCode,
      })

      if (deliveryMethods && !isEmpty(deliveryMethods)) {
        onSubmit(addressValues, deliveryMethods)
      } else {
        showUnsupportedAddressModal()
      }
    },
    [cardId, getCardDeliveryMethods, onSubmit, showUnsupportedAddressModal],
  )

  return (
    <>
      <DeliveryAddress
        address={selectedCard?.delivery?.addressDetails}
        isLoading={isFetching}
        closeUrl={`${Url.Cards}/${cardId}`}
        onSubmit={handleSubmit}
        onBackClick={handleBackClick}
      />
      <CardOrderingUnsupportedAddressModal {...unsupportedAddressModalProps} />
    </>
  )
}
