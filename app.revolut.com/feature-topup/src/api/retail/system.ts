import axios from 'axios'

import {
  ApplePayGatewayConfigRequestDto,
  ApplePayGatewayConfigResponseDto,
  GooglePayGatewayConfigRequestDto,
  GooglePayGatewayConfigResponseDto,
} from '@revolut/rwa-core-types'

export const getApplePayGatewayConfig = (data: ApplePayGatewayConfigRequestDto) =>
  axios.post<ApplePayGatewayConfigResponseDto>('/retail/config/gateway/apple-pay', data)

export const getGooglePayGatewayConfig = (data: GooglePayGatewayConfigRequestDto) =>
  axios.post<GooglePayGatewayConfigResponseDto>('/retail/config/gateway/google-pay', data)
