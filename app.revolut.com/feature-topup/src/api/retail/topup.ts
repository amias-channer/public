import axios from 'axios'

import {
  ProcessCheckoutComTokenRequestDto,
  ProcessCheckoutComTokenResponseDto,
  TopupByApplePayRequestDto,
  TopupByGooglePayRequestDto,
  TopupByExternalCardRequestDto,
  TopupByExternalCardResponseDto,
  TopupByNewExternalCardRequestDto,
  TopupCardIssuerDto,
  ValidateApplePayMerchantRequestDto,
  ValidateApplePayMerchantResponseDto,
} from '@revolut/rwa-core-types'

export const getCardIssuerInfo = (bin: string) =>
  axios.get<TopupCardIssuerDto>(`/retail/card-issuer/${bin}/info`)

export const topupByNewExternalCard = (data: TopupByNewExternalCardRequestDto) =>
  axios.post<TopupByExternalCardResponseDto>('/retail/topup/card', data)

export const topupByExternalCard = (data: TopupByExternalCardRequestDto) =>
  axios.post<TopupByExternalCardResponseDto>('/retail/topup/create', data)

export const processCheckoutComToken = (data: ProcessCheckoutComTokenRequestDto) =>
  axios.post<ProcessCheckoutComTokenResponseDto>(
    '/retail/topup/redirect/checkout/token',
    data,
  )

export const validateApplePayMerchant = (data: ValidateApplePayMerchantRequestDto) =>
  axios.post<ValidateApplePayMerchantResponseDto>(
    '/retail/topup/apple-pay/validate-merchant',
    data,
  )

export const topupByApplePay = (data: TopupByApplePayRequestDto) =>
  axios.post<void>('/retail/topup/apple-pay', data)

export const topupByGooglePay = (data: TopupByGooglePayRequestDto) =>
  axios.post<void>('/retail/topup/google-pay', data)

export const getTopupTransactionStatus = (transactionId: string) =>
  axios.get<void>(`/retail/topup/${transactionId}/status`)
