import { AxiosError } from 'axios'
import { useMutation } from 'react-query'

import {
  GeneralErrorDto,
  ExchangeResponseDto,
  ExchangeRequestDto,
} from '@revolut/rwa-core-types'

import { exchange } from '../../../api'

export const useFxExchange = () => {
  const { mutate, isLoading } = useMutation<
    ExchangeResponseDto[],
    AxiosError<GeneralErrorDto>,
    ExchangeRequestDto
  >(exchange)

  return {
    exchange: mutate,
    isExchangeProcessing: isLoading,
  }
}
