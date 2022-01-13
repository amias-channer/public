import { AxiosError, AxiosResponse } from 'axios'
import { useMutation, useQuery } from 'react-query'

import { verificationCode } from '@revolut/rwa-core-api'
import {
  PhoneNumberValue,
  UserAuthFlowElementDto,
  UserAuthFlowElementsRequestDto,
  UserAuthUserResponseDto,
} from '@revolut/rwa-core-types'
import { formatPhoneNumber, QueryKey } from '@revolut/rwa-core-utils'

import { authFlowElements, authFlowComplete } from 'api'

export const useRunAuthFlowElements = () => {
  const { mutate, isLoading } = useMutation<
    AxiosResponse<ReadonlyArray<UserAuthFlowElementDto>>,
    AxiosError,
    UserAuthFlowElementsRequestDto
  >(authFlowElements)

  return [mutate, isLoading] as [typeof mutate, boolean]
}

export const useQueryVerificationCode = (phoneNumber: PhoneNumberValue) => {
  const phone = formatPhoneNumber(phoneNumber)
  const { data: axiosData } = useQuery([QueryKey.VerificationCode, phone], () =>
    verificationCode(phone),
  )

  return axiosData?.data.code
}

export const useRunAuthFlowComplete = () => {
  // "react-query" won't call mutations with "undefined" variables type
  const { mutate } = useMutation<AxiosResponse<UserAuthUserResponseDto>, any>(
    authFlowComplete,
  )

  return mutate
}
