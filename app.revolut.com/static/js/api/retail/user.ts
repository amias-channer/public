import axios from 'axios'

import { VerificationConfig } from '@revolut/rwa-core-auth'
import { UserPasswordChangeRequestDto } from '@revolut/rwa-core-types'

export const changeUserPasscode = ({
  oldPassword,
  password,
}: UserPasswordChangeRequestDto) =>
  axios.post('/retail/user/password', {
    oldPassword,
    password,
  })

export type RequestPhoneChangeArgs = {
  phone: string
  config?: VerificationConfig
}

export const requestPhoneChange = ({ phone, config }: RequestPhoneChangeArgs) =>
  axios.post(
    '/retail/user/current/phone',
    {
      phone,
    },
    config,
  )

export type ConfirmPhoneChangeArgs = {
  phone: string
  otpCode: string
}

export const confirmPhoneChange = ({ phone, otpCode }: ConfirmPhoneChangeArgs) =>
  axios.post('/retail/user/current/phone/confirm', {
    phone,
    code: otpCode,
  })
