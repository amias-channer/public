import { useQuery } from 'react-query'

import { getSuspiciousTransactionBanner } from '../../api'
import { QueryKey } from './const'

export const useTransactionBanner = (transactionId: string) =>
  useQuery([QueryKey.Banner, transactionId], () =>
    getSuspiciousTransactionBanner(transactionId),
  )
