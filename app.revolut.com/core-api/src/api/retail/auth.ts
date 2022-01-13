import axios from 'axios'

import { VerificationCodeResponseDto } from '@revolut/rwa-core-types'

export const verificationCode = (phone: string) =>
  axios.get<VerificationCodeResponseDto>(`/retail/verification-code/${phone}`)
