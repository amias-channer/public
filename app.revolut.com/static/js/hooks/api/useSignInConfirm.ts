import { AxiosError, AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import {
  GeneralErrorDto,
  SignInConfirmRequestDto,
  SignInConfirmResponseDto,
} from '@revolut/rwa-core-types'

import { signInConfirm } from 'api'

export const useSignInConfirm = () => {
  const { mutate } = useMutation<
    AxiosResponse<SignInConfirmResponseDto>,
    AxiosError<GeneralErrorDto>,
    SignInConfirmRequestDto
  >(signInConfirm)

  return { signInConfirm: mutate }
}
