import { useMutation, useQuery } from 'react-query'
import * as Sentry from '@sentry/react'

import { useGetPendingCardPayment as useGetPendingCardPaymentApi } from '@revolut/rwa-core-api'
import { ConfigKey, FeatureKey, getConfigValue } from '@revolut/rwa-core-config'
import { useFeaturesConfig } from '@revolut/rwa-core-navigation'
import { CardBrand, CardCode, CardItemDto } from '@revolut/rwa-core-types'
import { decryptImage, isRestrictedAccessToken, QueryKey } from '@revolut/rwa-core-utils'

import {
  cancelCardCheckout,
  checkCardLimit,
  getOriginalCardDesign,
  getUserCard,
  getUserCardV2,
} from '../api'

const decryptCardImage = (data: CardItemDto | undefined) => {
  if (!data) {
    return undefined
  }

  if (data.image) {
    try {
      return decryptImage(data.image)
    } catch {
      Sentry.captureException(
        new Error(`card image for card ${data.id} can not be decrypted`),
      )
    }
  } else {
    Sentry.captureException(new Error(`card image for card ${data.id} does not exist`))
  }

  return undefined
}

export const useGetUserCard = (id: string) => {
  const isCookieAuth = getConfigValue<boolean>(ConfigKey.CookieAuth)

  const { data, isFetching } = useQuery(
    [QueryKey.UserCard, id],
    () => (isCookieAuth ? getUserCardV2(id) : getUserCard(id)),
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  )

  if (isCookieAuth || !data) {
    return {
      cardData: data,
      isFetching,
    }
  }

  return {
    cardData: {
      ...data,
      image: decryptCardImage(data),
    },
    isFetching,
  }
}

export const useGetOriginalCardDesign = () => {
  const { data, isFetching } = useQuery(
    QueryKey.OriginalCardDesign,
    getOriginalCardDesign,
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  )

  return {
    originalCardDesign: data,
    isOriginalCardDesignFetching: isFetching,
  }
}

export const useCheckOriginalCardLimit = () => {
  const { originalCardDesign } = useGetOriginalCardDesign()
  const { isFeatureActive } = useFeaturesConfig()

  const cardLimitParams = {
    brand: originalCardDesign?.brands[0] as CardBrand | undefined,
    design: CardCode.OriginalV2,
  }

  const { isLoading, isError } = useQuery(
    [QueryKey.PhysicalCardsLimit, cardLimitParams],
    () => checkCardLimit(cardLimitParams),
    {
      refetchOnWindowFocus: false,
      enabled:
        isFeatureActive(FeatureKey.AllowCardAdding) &&
        !isRestrictedAccessToken() &&
        Boolean(originalCardDesign),
    },
  )

  return { isLoading, isError }
}

export const useCancelCardCheckout = () => {
  const { mutate, isLoading } = useMutation(cancelCardCheckout)

  return { cancelCardCheckout: mutate, isLoading }
}

export const useGetPendingCardPayment = () => {
  const { isFeatureActive } = useFeaturesConfig()

  return useGetPendingCardPaymentApi(isFeatureActive(FeatureKey.AllowCardAdding))
}
