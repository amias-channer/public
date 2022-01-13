import isEmpty from 'lodash/isEmpty'
import { FC, useCallback, useEffect, useState } from 'react'
import { Button, Header, Layout } from '@revolut/ui-kit'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { useModal } from '@revolut/rwa-core-components'
import { AddressDto, CardDesignDto, DeliveryMethodName } from '@revolut/rwa-core-types'
import { checkRequired, formatMoneyWhenWholeNumber } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../../hooks'
import { useGetDeliveryMethods, useGetPhysicalCardPricing } from '../../hooks'
import { UnsupportedDeliveryAddressPopup } from '../popups'
import { DeliveryAddressWidget } from './DeliveryAddressWidget'
import { checkIfOnlyPaidMethodForFreeAvailable } from './utils'

type DeliveryAddressScreenProps = {
  cardDesign: CardDesignDto
  planId?: string
  isCardCheckoutProcessing: boolean
  onGoBack: VoidFunction
  onSubmit: (address: AddressDto, deliveryMethodName?: DeliveryMethodName) => void
}

export const DeliveryAddressScreen: FC<DeliveryAddressScreenProps> = ({
  cardDesign,
  planId,
  isCardCheckoutProcessing,
  onGoBack,
  onSubmit,
}) => {
  const t = useCardsTranslation()
  const { user } = useAuthContext()

  const { physicalCardFee, physicalCardFeeFetching } = useGetPhysicalCardPricing({
    cardDesign: cardDesign.code.toUpperCase(),
    planId,
  })

  const [currentAddress, setCurrentAddress] = useState(user?.address)

  const [showUnsupportedAddressPopup, unsupportedAddressPopupProps] = useModal()
  const { allDeliveryMethods, deliveryMethodsFetching } = useGetDeliveryMethods(
    cardDesign,
    currentAddress,
    planId,
  )

  useEffect(() => {
    setCurrentAddress(user?.address)
  }, [user?.address])

  const handleSaveAddress = useCallback((address: AddressDto) => {
    setCurrentAddress(address)
  }, [])

  const handleSubmit = useCallback(() => {
    const checkedAllDeliveryMethods = checkRequired(
      allDeliveryMethods,
      'delivery methods array can not be undefined',
    )

    const { deliveryMethods } = checkedAllDeliveryMethods

    if (!deliveryMethods || isEmpty(deliveryMethods)) {
      showUnsupportedAddressPopup()
      return
    }

    const isOnlyPaidMethodForFreeAvailable = checkIfOnlyPaidMethodForFreeAvailable(
      checkedAllDeliveryMethods,
    )

    const currentAddressChecked = checkRequired(
      currentAddress,
      'address can not be empty',
    )

    if (isOnlyPaidMethodForFreeAvailable) {
      onSubmit(currentAddressChecked, deliveryMethods[0].name)
    } else {
      onSubmit(currentAddressChecked)
    }
  }, [allDeliveryMethods, currentAddress, onSubmit, showUnsupportedAddressPopup])

  const getButtonCTA = () => {
    const isCardDeliveryFree =
      allDeliveryMethods && checkIfOnlyPaidMethodForFreeAvailable(allDeliveryMethods)

    if (isCardDeliveryFree) {
      if (physicalCardFee && physicalCardFee.amount > 0) {
        return t('CardOrdering.DeliveryAddressScreen.button_paid_card', {
          cardPrice: formatMoneyWhenWholeNumber(
            physicalCardFee.amount,
            physicalCardFee.currency,
          ),
        })
      }

      return t('CardOrdering.DeliveryAddressScreen.button_free')
    }

    return t('CardOrdering.DeliveryAddressScreen.button')
  }

  const isButtonLoading =
    deliveryMethodsFetching || physicalCardFeeFetching || isCardCheckoutProcessing

  return (
    <>
      <Layout>
        <Layout.Main>
          <Header variant="form">
            <Header.BackButton aria-label="Back" onClick={onGoBack} />

            <Header.Title>{t('CardOrdering.DeliveryAddressScreen.title')}</Header.Title>
          </Header>
          <DeliveryAddressWidget
            address={currentAddress}
            onSaveAddress={handleSaveAddress}
          />
        </Layout.Main>
        <Layout.Actions>
          <Button
            disabled={isButtonLoading}
            pending={isButtonLoading}
            elevated
            onClick={handleSubmit}
          >
            {getButtonCTA()}
          </Button>
        </Layout.Actions>
      </Layout>
      <UnsupportedDeliveryAddressPopup {...unsupportedAddressPopupProps} />
    </>
  )
}
