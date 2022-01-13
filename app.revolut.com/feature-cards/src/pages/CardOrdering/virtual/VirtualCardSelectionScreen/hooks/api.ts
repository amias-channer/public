import { AxiosError } from 'axios'
import { useCallback, useMemo } from 'react'
import { useQuery, UseMutationOptions } from 'react-query'

import { useGetUserCards } from '@revolut/rwa-core-api'
import {
  CardItemDto,
  CheckoutCardDto,
  CheckoutPricingPlanData,
  CheckoutResponseDto,
  VirtualCardDesignDto,
} from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'
import { useGetCurrentPricingPlan } from '@revolut/rwa-feature-pricing-plans'

import { getVirtualCardPricing, getVirtualCardDesigns } from '../../../../../api'
import { useCheckoutCard } from '../../../hooks'

const useGetVirtualCardDesigns = () => {
  const { data } = useQuery(QueryKey.VirtualCardDesigns, getVirtualCardDesigns, {
    staleTime: Infinity,
  })

  return { virtualCardDesigns: data }
}

const isDisposableCardOrdered = (cards: CardItemDto[]) =>
  cards.some((card) => card.disposable)

export const useGetAvailableVirtualCardDesigns = () => {
  const { virtualCardDesigns } = useGetVirtualCardDesigns()
  const { cards } = useGetUserCards()

  return useMemo(() => {
    if (!virtualCardDesigns || !cards) {
      return undefined
    }

    return virtualCardDesigns.filter(
      (virtualCardDesign) =>
        virtualCardDesign.code === 'original_virtual' ||
        (!isDisposableCardOrdered(cards) &&
          virtualCardDesign.code === 'original_disposable'),
    )
  }, [cards, virtualCardDesigns])
}

export const useGetVirtualCardPricing = (virtualCard?: VirtualCardDesignDto) => {
  const { currentPricingPlan } = useGetCurrentPricingPlan()

  const virtualCardQueryParams = {
    disposable: virtualCard?.disposable,
    cardDesign: virtualCard?.code.toUpperCase(),
    planId: currentPricingPlan?.id,
  }

  const { data } = useQuery(
    [QueryKey.VirtualCardPrice, virtualCardQueryParams],
    () => getVirtualCardPricing(virtualCardQueryParams),
    {
      enabled: Boolean(currentPricingPlan) && Boolean(virtualCard),
      refetchOnWindowFocus: false,
    },
  )

  return {
    virtualCardFee: data,
    appliedVirtualCardCode: virtualCard?.code,
  }
}

export const useOrderVirtualCard = () => {
  const { checkoutCard, isLoading } = useCheckoutCard()

  const orderVirtualCard = useCallback(
    (
      {
        virtualCardDesign,
        pricingPlanData,
      }: {
        virtualCardDesign: VirtualCardDesignDto
        pricingPlanData?: CheckoutPricingPlanData
      },
      {
        onSuccess,
        onError,
      }: UseMutationOptions<CheckoutResponseDto, AxiosError, CheckoutCardDto>,
    ) => {
      const checkoutData: CheckoutCardDto = {
        card: {
          brand: virtualCardDesign.brand.toUpperCase(),
          design: virtualCardDesign.code.toUpperCase(),
          disposable: virtualCardDesign.disposable,
          virtual: true,
        },
      }

      if (pricingPlanData) {
        checkoutData.plan = pricingPlanData
      }

      checkoutCard(checkoutData, {
        onSuccess,
        onError,
      })
    },
    [checkoutCard],
  )

  return { orderVirtualCard, isCardOrderProcessing: isLoading }
}
