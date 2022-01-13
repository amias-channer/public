import axios, { AxiosResponse } from 'axios'
import { TransactionDto, TransactionPatchRequestData } from '@revolut/rwa-core-types'

type TransactionsRequestData = {
  count: number
  to?: number
  from?: number
  pocketId?: string
}

type LastTransactionsRequestData = {
  count: number
  to?: number
  from?: number
  accountId?: string
}

export const getTransactions = ({
  count,
  to,
  from,
  pocketId,
}: TransactionsRequestData): Promise<AxiosResponse<TransactionDto[]>> => {
  return axios.get<TransactionDto[]>('retail/user/current/transactions', {
    params: {
      to,
      from,
      count,
      pocketId,
    },
  })
}

export const getLastTransactions = ({
  count,
  to,
  from,
  accountId,
}: LastTransactionsRequestData): Promise<AxiosResponse<TransactionDto[]>> => {
  return axios.get<TransactionDto[]>('retail/user/current/transactions/last', {
    params: {
      to,
      from,
      count,
      internalPocketId: accountId,
    },
  })
}

export const confirmTransaction = (id: string) =>
  axios.post(`retail/transaction/${id}/confirm`)

export const declineTransaction = (id: string) =>
  axios.post(`retail/transaction/${id}/deny`)

export const patchTransaction = ({
  id,
  requestData,
}: {
  id: string
  requestData: TransactionPatchRequestData
}) => axios.patch(`retail/transaction/${id}`, requestData)
