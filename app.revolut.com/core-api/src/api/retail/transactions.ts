import { TransactionDto } from '@revolut/rwa-core-types'
import axios from 'axios'

export const getTransactionById = async (id: string) => {
  const { data } = await axios.get<TransactionDto[]>(`retail/transaction/${id}`)

  return data
}
