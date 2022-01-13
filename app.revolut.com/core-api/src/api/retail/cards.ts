import axios from 'axios'

import { CardItemDto } from '@revolut/rwa-core-types'

export const getAllCards = async () => {
  const { data: cards } = await axios.get<CardItemDto[]>('/retail/my-card/all')

  return cards
}
