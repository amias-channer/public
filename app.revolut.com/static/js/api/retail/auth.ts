import axios from 'axios'

import {
  BiometricSignInConfirmResponseDto,
  BiometricSignInSubmitSelfieResponseDto,
  SignInConfirmRequestDto,
  SignInConfirmResponseDto,
  SignInInitializeRequestDto,
  SignInInitializeResponseDto,
  SignInTokenRequestDto,
  SignInTokenResponseDto,
  UserAuthFlowElementDto,
  UserAuthFlowElementsRequestDto,
  UserAuthUserResponseDto,
} from '@revolut/rwa-core-types'
import { HttpHeader } from '@revolut/rwa-core-utils'

const SELFIE_FILENAME = 'selfie.jpg'

export const authFlowElements = (data: UserAuthFlowElementsRequestDto) =>
  axios.post<ReadonlyArray<UserAuthFlowElementDto>>(
    '/retail/user/auth/flow/elements',
    data,
  )

export const authFlowComplete = () =>
  axios.post<UserAuthUserResponseDto>('/retail/user/auth/flow/complete')

export const signOut = () => axios.post('/retail/signout')

export const confirmPushNotificationRequest = ({
  phone,
  deviceId,
}: {
  phone: string
  deviceId: string
}) => axios.post<void>(`/retail/verification-code/${phone}/confirm/${deviceId}`)

export const rejectPushNotificationRequest = ({
  phone,
  deviceId,
}: {
  phone: string
  deviceId: string
}) => axios.post<void>(`/retail/verification-code/${phone}/reject/${deviceId}`)

export const invalidateAccessRecovery = (sessionId: string) =>
  axios.post<void>('/retail/anonymous-sessions/invalidate', undefined, {
    headers: { [HttpHeader.AccessRecoverySessionId]: sessionId },
  })

export const submitSelfie = (selfie: Blob) => {
  const formData = new FormData()

  formData.append('selfie', selfie, SELFIE_FILENAME)

  return axios.post<BiometricSignInSubmitSelfieResponseDto>(
    '/retail/biometric-signin/selfie',
    formData,
  )
}

export const confirmSelfieSubmission = (id: string) =>
  axios.post<BiometricSignInConfirmResponseDto>(`/retail/biometric-signin/confirm/${id}`)

export const signInInitialize = (data: SignInInitializeRequestDto) =>
  axios.post<SignInInitializeResponseDto>('/retail/signin', data)

export const signInConfirm = (data: SignInConfirmRequestDto) =>
  axios.post<SignInConfirmResponseDto>('/retail/signin/confirm', data)

export const signInToken = (data: SignInTokenRequestDto) =>
  axios.post<SignInTokenResponseDto>('/retail/token', data)
