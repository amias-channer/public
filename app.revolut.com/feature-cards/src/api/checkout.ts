import axios from 'axios'

import { CheckoutCardDto, CheckoutResponseDto } from '@revolut/rwa-core-types'

export const checkoutCard = async (
  requestData: CheckoutCardDto,
): Promise<CheckoutResponseDto> => {
  const { data } = await axios.post<CheckoutResponseDto>(
    '/retail/checkouts/cards',
    requestData,
  )

  return data
}

export const cancelCardCheckout = async (cardId: string) =>
  axios.delete<CheckoutResponseDto>(`/retail/checkouts/cards/${cardId}`)
