import axios from 'axios'

import {
  PromotionRequestDto,
  PromotionForbiddenResponseDto,
} from '@revolut/rwa-core-types'

const CODE = 'WEBSITE19'

export const linkPhoneToPromotion = (data: PromotionRequestDto) =>
  axios.post<void | PromotionForbiddenResponseDto>(`/promotion/${CODE}`, data)
