import axios from 'axios'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import { HttpHeader } from '@revolut/rwa-core-utils'

const mallApi = axios.create({
  baseURL: getConfigValue(ConfigKey.MallApi),
  headers: {},
})

type MallPayBrowser = {
  screen_width: number
  screen_height: number
  challenge_window_width: number
  color_depth: number
  tz_utc_offset_mins: number
}

type MallPayRequestDto = {
  card: {
    pan: string
    cvv: string
    expiry: string
  }
  browser: MallPayBrowser
  customer: {
    billing_address: string
    email: string
    name: string
  }
  save_payment_method_for: 'MERCHANT'
}

type MallPayByExistingMethodRequestDto = {
  payment_method: {
    id: string
    cvv?: string
  }
  browser: MallPayBrowser
  save_payment_method_for: 'MERCHANT'
}

export enum MallPayPaymentState {
  Declined = 'DECLINED',
  Failed = 'FAILED',
  AuthenticationVerified = 'AUTHENTICATION_VERIFIED',
  Authorised = 'AUTHORISED',
  AuthorisationStarted = 'AUTHORISATION_STARTED',
  AuthenticationChallenge = 'AUTHENTICATION_CHALLENGE',
}

type MallPayChallenge = {
  type: 'THREE_DS'
  acs_url: string
}

type MallPayResponseDto = {
  public_id: string
  payment_state: MallPayPaymentState
  challenge?: MallPayChallenge
}

type MallPayArgs = { orderId: string; transactionId: string; data: MallPayRequestDto }

export const mallPay = ({ orderId, transactionId, data }: MallPayArgs) =>
  mallApi.post<MallPayResponseDto>(`/api/public/1.0/orders/${orderId}/pay`, data, {
    headers: {
      [HttpHeader.IdempotencyKey]: transactionId,
    },
  })

type MallPayByExistingMethodArgs = {
  orderId: string
  transactionId: string
  data: MallPayByExistingMethodRequestDto
}

export const mallPayByExistingMethod = ({
  orderId,
  transactionId,
  data,
}: MallPayByExistingMethodArgs) =>
  mallApi.post<MallPayResponseDto>(`/api/public/1.0/orders/${orderId}/pay`, data, {
    headers: {
      [HttpHeader.IdempotencyKey]: transactionId,
    },
  })
