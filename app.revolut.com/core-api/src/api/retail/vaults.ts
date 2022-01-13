import axios from 'axios'

import { BillAccountDto, VaultDto, ProductPerPlanDto } from '@revolut/rwa-core-types'

export const getUserVaults = async () => {
  const { data } = await axios.get<VaultDto[]>('/retail/user/current/money-boxes')

  return data
}

export const getUserBillAccounts = async () => {
  const { data } = await axios.get<BillAccountDto[]>(
    '/retail/user/current/money-boxes/bills',
  )

  return data
}

export const getBestDepositProductsPerPlans = async () => {
  const { data } = await axios.get<ProductPerPlanDto[]>(
    '/retail/money-boxes/deposits/products/best-per-plan',
  )

  return data
}
