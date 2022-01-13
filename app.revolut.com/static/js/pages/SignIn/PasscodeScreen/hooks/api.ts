import { AxiosError, AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import {
  SignInInitializeErrorResponseDto,
  SignInInitializeRequestDto,
  SignInInitializeResponseDto,
} from '@revolut/rwa-core-types'

import { signInInitialize } from 'api'

export const useSignIn = () => {
  const { mutate } = useMutation<
    AxiosResponse<SignInInitializeResponseDto>,
    AxiosError<SignInInitializeErrorResponseDto>,
    SignInInitializeRequestDto
  >(signInInitialize)

  return { signIn: mutate }
}
