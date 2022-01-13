import axios from 'axios'

import { NewsItemDto } from '@revolut/rwa-core-types'

export const fetchIncidentBanners = async () => {
  const { data } = await axios.get<NewsItemDto[]>('retail/news/incidents')
  return data
}
