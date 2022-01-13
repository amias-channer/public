import axios from 'axios'

import { CreatePocketRequestDto, WalletPocketDto } from '@revolut/rwa-core-types'

export const createPocket = (data: CreatePocketRequestDto) => {
  return axios.post<WalletPocketDto>('retail/pocket', data)
}

export const createBankAddress = (currencyCode: string) => {
  return axios.post(`retail/pocket/${currencyCode}/address`)
}
