import axios from 'axios'

import { getWallet } from '@revolut/rwa-core-api'
import { VerificationConfig } from '@revolut/rwa-core-auth'
import {
  CardDesignDto,
  CardItemDto,
  CardFeeDto,
  CardSettingsDto,
  CardDeliveryUpdateDto,
  DeliveryMethodsDto,
  VirtualCardDesignDto,
  CardPricingQuery,
  CardPricingDto,
  CardImageDataDto,
} from '@revolut/rwa-core-types'
import { encryptText } from '@revolut/rwa-core-utils'

export const getUserCard = async (cardId: string) => {
  const { data } = await axios.get<CardItemDto>(`/retail/my-card/${cardId}`)

  return data
}

export const getUserCardV2 = async (cardId: string) => {
  const { data } = await axios.get<CardItemDto>(`/retail/my-card/${cardId}/v2`)

  return data
}

export const getUserCardImageData = async ({
  cardId,
  config,
}: {
  cardId: string
  config?: VerificationConfig
}) => {
  const { data } = await axios.get<CardImageDataDto>(
    `/retail/my-card/${cardId}/image-data`,
    config,
  )

  return data
}

export const getUserCardImageDataV2 = async ({
  cardId,
  config,
}: {
  cardId: string
  config?: VerificationConfig
}) => {
  const { data } = await axios.get<CardImageDataDto>(
    `/retail/my-card/${cardId}/image-data/v2`,
    config,
  )

  return data
}

export const freezeCard = async (cardId: string) => {
  const { data } = await axios.post<CardItemDto>(`/retail/my-card/${cardId}/block`)

  return data
}

export const unfreezeCard = async (cardId: string) => {
  const { data } = await axios.post<CardItemDto>(`/retail/my-card/${cardId}/unblock`)

  return data
}

export const deactivateCard = async (cardId: string) => {
  await axios.post(`/retail/my-card/${cardId}/report-lost`)
}

export const terminateCard = async (cardId: string) => {
  const { data } = await axios.delete<CardItemDto>(`/retail/my-card/${cardId}`)

  return data
}

export const unblockCard = async (cardId: string) => {
  await axios.post(`/retail/my-card/${cardId}/pin/unblock`)
}

export const updateCardSettings = async ({
  cardId,
  updatedSettings,
}: {
  cardId: string
  updatedSettings: CardSettingsDto
}) => {
  await axios.put(`/retail/my-card/${cardId}/settings`, updatedSettings)
}

export const activateCard = async ({
  cardId,
  cardNumber,
}: {
  cardId: string
  cardNumber: string
}) => {
  const { data } = await axios.post<CardItemDto>(
    `/retail/my-card/${cardId}/delivery/confirm`,
    {
      pan: encryptText(cardNumber),
    },
  )

  return data
}

export const checkCardLimit = async ({
  brand,
  cardIdToReplace,
  design,
}: {
  brand?: string
  cardIdToReplace?: string
  design: string
}) => {
  return axios.get('/retail/my-card/order/available', {
    params: {
      brand,
      cardIdToReplace,
      design,
    },
  })
}

export const getDeliveryMethods = async ({
  country,
  postcode,
  brand,
  design,
  planId,
}: {
  country?: string
  postcode?: string
  brand?: string
  design?: string
  planId?: string
}) => {
  const { data } = await axios.get<DeliveryMethodsDto>('/retail/delivery/methods', {
    params: {
      country,
      postcode,
      brand,
      design,
      planId,
    },
  })

  return data
}

const getCardPricing = async (params: CardPricingQuery) => {
  const { data: cardPriceData } = await axios.get<CardFeeDto>('/retail/my-card/pricing', {
    params,
  })

  return cardPriceData.price
}

const getCardsPricing = async (physical: boolean) => {
  const { data } = await axios.get<CardPricingDto[]>('/retail/my-card/pricing/all', {
    params: {
      physical,
    },
  })

  return data
}

export const getPhysicalCardPricing = (
  params?: Pick<CardPricingQuery, 'cardDesign' | 'planId'>,
) => getCardPricing({ physical: true, ...params })

export const getPhysicalCardsPricing = () => getCardsPricing(true)

export const getVirtualCardPricing = (
  virtualCardQueryParams: Pick<CardPricingQuery, 'disposable' | 'cardDesign' | 'planId'>,
) => getCardPricing({ physical: false, ...virtualCardQueryParams })

export const getCardDesigns = async () => {
  const { data: walletData } = await getWallet()

  const { data } = await axios.get<CardDesignDto[]>('/retail/my-card/designs/v2', {
    params: {
      walletId: walletData.id,
      credit: false,
    },
  })

  return data
}

export const getVirtualCardDesigns = async () => {
  const { data } = await axios.get<VirtualCardDesignDto[]>(
    '/retail/my-card/designs/virtual',
    {
      params: {
        credit: false,
      },
    },
  )

  return data
}

export const getOriginalCardDesign = async (): Promise<CardDesignDto | undefined> => {
  const cardDesigns = await getCardDesigns()

  return cardDesigns.find((cardDesign) => cardDesign.color === 'original')
}

export const getCardDeliveryMethods = async ({
  cardId,
  country,
  postcode,
}: {
  cardId: string
  country: string
  postcode: string
}) => {
  const { data } = await axios.get<DeliveryMethodsDto>(
    `/retail/my-card/${cardId}/delivery`,
    {
      params: {
        country,
        postcode,
      },
    },
  )

  return data
}

export type UpdateCardDeliverySettingsArgs = {
  cardId: string
} & CardDeliveryUpdateDto

export const updateCardDeliverySettings = async ({
  cardId,
  address,
  method,
}: UpdateCardDeliverySettingsArgs) => {
  const { data } = await axios.patch<CardItemDto>(`/retail/my-card/${cardId}/delivery`, {
    address,
    method,
  })

  return data
}
