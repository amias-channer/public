import pick from 'lodash/pick'
import { FC, useEffect, useState } from 'react'

import { FullPageLoader, useModal } from '@revolut/rwa-core-components'
import { CheckoutPricingPlanData, VirtualCardDesignDto } from '@revolut/rwa-core-types'
import { checkRequired, useNavigateToErrorPage } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../../hooks'
import { SpareCardPopup, SpareCardType } from '../../components'
import { VirtualCardsSuccessOrderPopup } from '../components'
import { VirtualCardsLimitReachedPopup } from '../components/VirtualCardsLimitReachedPopup'
import { VirtualCardType } from '../constants'
import {
  useCheckVirtualCardLimit,
  useGetVirtualCardPricing,
  useGetVirtualCardTypesOptions,
  useOrderVirtualCard,
  useSuccessVirtualCardOrder,
} from './hooks'
import { VirtualCardText } from './styled'
import {
  VirtualCardTypeOptions,
  VirtualCardTypeSelection,
} from './VirtualCardTypeSelection'

export const VirtualCardSelectionScreen: FC = () => {
  const t = useCardsTranslation()
  const navigateToErrorPage = useNavigateToErrorPage()

  const [selectedVirtualCardDesign, setSelectedVirtualCardDesign] =
    useState<VirtualCardDesignDto>()

  const virtualCardTypesOptions = useGetVirtualCardTypesOptions()
  const { isFetching: isCardLimitChecking, isError: isCardUnavailable } =
    useCheckVirtualCardLimit(selectedVirtualCardDesign)
  const { orderVirtualCard, isCardOrderProcessing } = useOrderVirtualCard()
  const { virtualCardFee, appliedVirtualCardCode } = useGetVirtualCardPricing(
    selectedVirtualCardDesign,
  )

  const [showSpareCardPopup, spareCardPopupProps] = useModal()
  const [showLimitReachedModal, limitReachedModalProps] = useModal()

  const [onSuccessDisposableCardOrder, disposableCardSuccessPopupProps] =
    useSuccessVirtualCardOrder()

  const [onSuccessVirtualCardOrder, virtualCardSuccessPopupProps] =
    useSuccessVirtualCardOrder()

  useEffect(() => {
    if (isCardLimitChecking) {
      return
    }

    if (isCardUnavailable) {
      showLimitReachedModal()

      return
    }

    const isVirtualCardPriceFetched =
      virtualCardFee &&
      selectedVirtualCardDesign &&
      selectedVirtualCardDesign.code === appliedVirtualCardCode

    if (!isVirtualCardPriceFetched) {
      return
    }

    const isVirtualCardFree = virtualCardFee!.amount === 0

    if (!isVirtualCardFree) {
      showSpareCardPopup()

      return
    }

    orderVirtualCard(
      { virtualCardDesign: selectedVirtualCardDesign! },
      {
        onSuccess: selectedVirtualCardDesign!.disposable
          ? onSuccessDisposableCardOrder
          : onSuccessVirtualCardOrder,
        onError: () =>
          navigateToErrorPage(
            `Error while ordering virtual card ${selectedVirtualCardDesign!.code}`,
          ),
      },
    )
  }, [
    isCardLimitChecking,
    isCardUnavailable,
    appliedVirtualCardCode,
    navigateToErrorPage,
    orderVirtualCard,
    selectedVirtualCardDesign,
    showSpareCardPopup,
    showLimitReachedModal,
    virtualCardFee,
    onSuccessDisposableCardOrder,
    onSuccessVirtualCardOrder,
  ])

  const handleCardTypeSubmit = (virtualCardType: VirtualCardTypeOptions) => {
    setSelectedVirtualCardDesign(pick(virtualCardType, ['code', 'brand', 'disposable']))
  }

  const handleOrderVirtualCardPaid = (pricingPlanData?: CheckoutPricingPlanData) => {
    const checkedSelectedVirtualCardDesign = checkRequired(
      selectedVirtualCardDesign,
      'virtual card should be selected before pricing plans',
    )

    orderVirtualCard(
      { virtualCardDesign: checkedSelectedVirtualCardDesign, pricingPlanData },
      {
        onSuccess: onSuccessVirtualCardOrder,
        onError: () =>
          navigateToErrorPage(
            `Error while ordering virtual card ${checkedSelectedVirtualCardDesign.code}`,
          ),
      },
    )
  }

  if (!virtualCardTypesOptions) {
    return <FullPageLoader />
  }

  return (
    <>
      <VirtualCardTypeSelection
        cardTypesOptions={virtualCardTypesOptions}
        renderContent={(cardType) => {
          return (
            <VirtualCardText>
              {t(
                `CardOrdering.VirtualCardSelection.${
                  cardType === VirtualCardType.Virtual ? 'virtual' : 'disposable'
                }.content`,
              )}
            </VirtualCardText>
          )
        }}
        isCardOrderProcessing={isCardOrderProcessing}
        isCardLimitChecking={isCardLimitChecking}
        onSubmit={handleCardTypeSubmit}
      />
      {virtualCardFee && (
        <SpareCardPopup
          {...spareCardPopupProps}
          spareCardType={SpareCardType.Virtual}
          price={virtualCardFee}
          onOrderClick={handleOrderVirtualCardPaid}
          onPricingPlanSelected={handleOrderVirtualCardPaid}
        />
      )}
      <VirtualCardsSuccessOrderPopup
        {...disposableCardSuccessPopupProps}
        type={VirtualCardType.Disposable}
      />
      <VirtualCardsSuccessOrderPopup
        {...virtualCardSuccessPopupProps}
        type={VirtualCardType.Virtual}
      />
      <VirtualCardsLimitReachedPopup {...limitReachedModalProps} />
    </>
  )
}
