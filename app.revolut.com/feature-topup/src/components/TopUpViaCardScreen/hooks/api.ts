import { AxiosError } from 'axios'
import isNil from 'lodash/isNil'
import { useQuery, useMutation } from 'react-query'

import { GeneralErrorDto } from '@revolut/rwa-core-types'
import { checkRequired, HttpCode, QueryKey, ApiErrorCode } from '@revolut/rwa-core-utils'

import {
  getCardIssuerInfo,
  getCheckoutComToken,
  getTopupTransactionStatus,
  mallPay,
  mallPayByExistingMethod,
  processCheckoutComToken,
  topupByExternalCard,
  topupByNewExternalCard,
} from '../../../api'
import { validateBin } from '../../../utils'

const TRANSACTION_STATUS_RETRY_DELAY = 2000

export const useQueryCardIssuerInfo = (bin?: string) => {
  const { data } = useQuery(
    [QueryKey.CardIssuerInfo, bin],
    () => getCardIssuerInfo(checkRequired(bin, '"bin" can not be empty')),
    {
      enabled: bin ? validateBin(bin) : false,
      staleTime: Infinity,
    },
  )

  return { data }
}

export const useTopupByNewExternalCard = () => {
  const { mutate } = useMutation(topupByNewExternalCard)

  return mutate
}

export const useTopupByExternalCard = () => {
  const { mutate } = useMutation(topupByExternalCard)

  return mutate
}

export const useGetCheckoutComToken = () => {
  const { mutate } = useMutation(getCheckoutComToken)

  return mutate
}

export const useProcessCheckoutComToken = () => {
  const { mutate } = useMutation(processCheckoutComToken)

  return mutate
}

export const useMallPay = () => {
  const { mutate } = useMutation(mallPay)

  return mutate
}

export const useMallPayByExistingMethod = () => {
  const { mutate } = useMutation(mallPayByExistingMethod)

  return mutate
}

export const useQueryTopupTransactionStatus = (transactionId?: string) => {
  const { status } = useQuery(
    [QueryKey.TopupTransactionStatus, transactionId],
    () =>
      getTopupTransactionStatus(
        checkRequired(transactionId, '"transactionId" can not be empty'),
      ),
    {
      enabled: !isNil(transactionId),
      staleTime: 0,

      retry: (_failureCount, error: AxiosError<GeneralErrorDto>) =>
        error.response?.status === HttpCode.UnprocessableEntity &&
        error.response?.data.code === ApiErrorCode.TopupCardTopupPending,

      retryDelay: () => TRANSACTION_STATUS_RETRY_DELAY,
    },
  )

  return { status }
}
