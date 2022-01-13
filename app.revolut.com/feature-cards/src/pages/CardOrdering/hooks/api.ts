import { AxiosError } from 'axios'
import { useMutation, useQuery } from 'react-query'

import { useGetUserCards } from '@revolut/rwa-core-api'
import {
  AddressDto,
  CardDesignDto,
  CardPricingQuery,
  CheckoutCardDto,
  CheckoutResponseDto,
} from '@revolut/rwa-core-types'
import { checkRequired, QueryKey } from '@revolut/rwa-core-utils'
import { useGetCurrentPricingPlan } from '@revolut/rwa-feature-pricing-plans'

import {
  checkCardLimit,
  checkoutCard,
  getDeliveryMethods,
  getPhysicalCardPricing,
  getPhysicalCardsPricing,
} from '../../../api'

export const useGetDeliveryMethods = (
  card: CardDesignDto,
  address?: AddressDto,
  planId?: string,
) => {
  const { data, isFetching } = useQuery(
    [QueryKey.DeliveryMethods, card.code, address],
    () =>
      getDeliveryMethods({
        postcode: address?.postcode,
        country: address?.country,
        brand: card.brands[0],
        design: card.code.toUpperCase(),
        planId,
      }),
    {
      enabled: Boolean(address),
      refetchOnWindowFocus: false,
    },
  )

  return {
    allDeliveryMethods: data,
    deliveryMethodsFetching: isFetching,
  }
}

export const useGetPhysicalCardPricing = (
  params?: Pick<CardPricingQuery, 'cardDesign' | 'planId'>,
) => {
  const { data, isFetching } = useQuery(
    [QueryKey.PhysicalCardPrice, params?.cardDesign, params?.planId],
    () =>
      getPhysicalCardPricing(
        params ? { ...params, cardDesign: params.cardDesign?.toUpperCase() } : undefined,
      ),
    {
      refetchOnWindowFocus: false,
    },
  )

  return {
    physicalCardFee: data,
    physicalCardFeeFetching: isFetching,
  }
}

export const useGetPhysicalCardsPricing = () => {
  const { cards } = useGetUserCards()
  const { currentPricingPlan } = useGetCurrentPricingPlan()

  const { data } = useQuery(
    [QueryKey.PhysicalCardPrice, cards?.map((card) => card.id), currentPricingPlan?.id],
    getPhysicalCardsPricing,
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  )

  return {
    physicalCardsPricing: data,
  }
}

export const useCheckoutCard = () => {
  const { mutate, isLoading } = useMutation<
    CheckoutResponseDto,
    AxiosError,
    CheckoutCardDto
  >(checkoutCard)

  return { checkoutCard: mutate, isLoading }
}

export const useCheckCardLimit = (params?: { design: string; brand?: string }) => {
  const cardLimitParams = params
    ? {
        design: params.design.toUpperCase(),
        brand: params.brand,
      }
    : undefined

  const { isFetching, isError } = useQuery(
    [QueryKey.CardsLimit, cardLimitParams],
    () => checkCardLimit(checkRequired(cardLimitParams)),
    {
      enabled: Boolean(cardLimitParams),
      refetchOnWindowFocus: false,
    },
  )

  return { isFetching, isError }
}
