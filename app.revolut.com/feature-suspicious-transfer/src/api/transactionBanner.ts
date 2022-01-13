import axios from 'axios'

import { UUID } from '@revolut/rwa-core-types/types'

import { SuspiciousTransactionBanner } from '../types'
import { SuspiciousTransactionApiUrlPrefix } from './consts'

export const getSuspiciousTransactionBanner = async (
  transactionId: UUID,
): Promise<SuspiciousTransactionBanner> => {
  const { data } = await axios.get<SuspiciousTransactionBanner>(
    `sow/${SuspiciousTransactionApiUrlPrefix}/${transactionId}/banner`,
  ) // TODO: [CXA-3237] sow is a tmp solution

  return data
}
