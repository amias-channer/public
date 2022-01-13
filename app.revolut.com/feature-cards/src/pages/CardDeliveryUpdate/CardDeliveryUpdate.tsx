import { AxiosError } from 'axios'
import { FC, useCallback, useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

import { AddressFormValues, useModal } from '@revolut/rwa-core-components'
import { CardItemDto, Currency, DeliveryMethodDto } from '@revolut/rwa-core-types'
import {
  ApiErrorCode,
  checkRequired,
  getAxiosApiErrorCode,
  QueryKey,
  Url,
  useNavigateToErrorPage,
} from '@revolut/rwa-core-utils'

import { CardDeliveryInsufficientFundsModal } from '../../components'
import { DeliveryAddressScreen } from './DeliveryAddressScreen'
import { DeliveryDetails } from './CardDeliveryScreens'
import { SuccessScreen } from './SuccessScreen'
import { TopUp } from './TopUp'
import { Screen } from './constants'
import { useUpdateCardDeliverySettings } from './hooks'

export const CardDeliveryUpdate: FC = () => {
  const queryClient = useQueryClient()
  const navigateToErrorPage = useNavigateToErrorPage()
  const { cardId } = useParams<{ cardId: string }>()
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.DeliveryAddress)
  const deliveryMethodsRef = useRef<DeliveryMethodDto[]>()
  const updatedCardRef = useRef<CardItemDto>()
  const addressValuesRef = useRef<AddressFormValues>()
  const { updateCardDeliverySettings, errorParams } = useUpdateCardDeliverySettings()
  const [showInsufficientFundsModal, insufficientFundsModalProps] = useModal()

  const handleAddressSubmit = useCallback(
    (
      addressFormValues: AddressFormValues,
      availableDeliveryMethods: DeliveryMethodDto[],
    ) => {
      addressValuesRef.current = addressFormValues
      deliveryMethodsRef.current = availableDeliveryMethods
      setCurrentScreen(Screen.DeliveryDetails)
    },
    [],
  )

  const handleDeliveryDetailsScreenBack = () => {
    setCurrentScreen(Screen.DeliveryAddress)
  }

  const handleAddMoney = () => {
    setCurrentScreen(Screen.TopUp)
  }

  const handleTopUpAction = () => {
    setCurrentScreen(Screen.DeliveryDetails)
  }

  const handleDeliveryUpdateError = useCallback(
    (error: AxiosError) => {
      const errorCode = getAxiosApiErrorCode(error)

      if (errorCode === ApiErrorCode.InsufficientBalance) {
        showInsufficientFundsModal()
      } else {
        navigateToErrorPage(error)
      }
    },
    [navigateToErrorPage, showInsufficientFundsModal],
  )

  const refreshQueries = useCallback(async () => {
    await queryClient.invalidateQueries(QueryKey.Wallet)
    await queryClient.invalidateQueries(QueryKey.Cards)
    await queryClient.invalidateQueries([QueryKey.UserCard, cardId])
  }, [queryClient, cardId])

  const handleDeliveryUpdateSuccess = useCallback(
    async (data: CardItemDto) => {
      await refreshQueries()
      updatedCardRef.current = data
      setCurrentScreen(Screen.Success)
    },
    [refreshQueries],
  )

  const handleDeliveryDetailsScreenSubmit = async (deliveryMethod: DeliveryMethodDto) => {
    const checkedAddress = checkRequired(
      addressValuesRef.current,
      'address values cannot be empty',
    )

    await updateCardDeliverySettings(
      {
        cardId,
        address: {
          streetLine1: checkedAddress.addressLine1,
          streetLine2: checkedAddress.addressLine2,
          city: checkedAddress.city,
          country: checkedAddress.country,
          postcode: checkedAddress.postCode,
        },
        method: deliveryMethod.name,
      },
      {
        onError: handleDeliveryUpdateError,
        onSuccess: handleDeliveryUpdateSuccess,
      },
    )
  }

  const updatedCard = updatedCardRef.current
  const deliveryMethods = deliveryMethodsRef.current

  const cardSettingsUrl = `${Url.Cards}/${cardId}`

  switch (currentScreen) {
    case Screen.DeliveryAddress:
      return <DeliveryAddressScreen cardId={cardId} onSubmit={handleAddressSubmit} />
    case Screen.DeliveryDetails:
      return (
        <>
          <DeliveryDetails
            deliveryMethods={checkRequired(
              deliveryMethods,
              'delivery methods can not be empty',
            )}
            closeUrl={cardSettingsUrl}
            onBackClick={handleDeliveryDetailsScreenBack}
            onSubmit={handleDeliveryDetailsScreenSubmit}
          />
          <CardDeliveryInsufficientFundsModal
            {...insufficientFundsModalProps}
            currency={errorParams?.amountLacking?.currency as Currency}
            onConfirm={handleAddMoney}
          />
        </>
      )
    case Screen.Success:
      return (
        <SuccessScreen
          address={checkRequired(
            updatedCard?.delivery?.address,
            'updated card address is required',
          )}
          cardBrand={checkRequired(updatedCard?.brand, 'updated card brand is required')}
          cardId={cardId}
          lastFour={checkRequired(
            updatedCard?.lastFour,
            'updated card last four digits required',
          )}
        />
      )
    case Screen.TopUp:
      return <TopUp onGoBack={handleTopUpAction} onPaymentSuccess={handleTopUpAction} />
    default:
      throw new Error(
        `Card delivery update screen ${currentScreen} not reachable. It needs to be handled.`,
      )
  }
}
