import { uniqBy } from 'lodash'

import { TransactionDto } from '@revolut/rwa-core-types'

export const concatTransactionsBatch = (
  transactionsBatch: TransactionDto[][],
  isForPocket?: boolean,
) =>
  transactionsBatch.reduce((acc: TransactionDto[], batch: TransactionDto[]) => {
    if (!isForPocket) {
      return acc.concat(uniqBy(batch, ({ legId }) => legId))
    }

    return acc.concat(batch)
  }, [])
