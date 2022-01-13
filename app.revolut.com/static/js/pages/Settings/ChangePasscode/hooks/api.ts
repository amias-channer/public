import { AxiosError, AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { GeneralErrorDto, UserPasswordChangeRequestDto } from '@revolut/rwa-core-types'

import { changeUserPasscode } from 'api'

export const useChangeUserPasscode = () => {
  const { mutate, isLoading } = useMutation<
    AxiosResponse<void>,
    AxiosError<GeneralErrorDto>,
    UserPasswordChangeRequestDto
  >(changeUserPasscode)

  return {
    changePasscode: mutate,
    isLoading,
  }
}
