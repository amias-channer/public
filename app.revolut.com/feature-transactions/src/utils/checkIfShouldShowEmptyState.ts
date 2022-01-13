import { isEmpty, last } from 'lodash'

import { TransactionDto } from '@revolut/rwa-core-types'

export const checkIfShouldShowEmptyState = (
  data: TransactionDto[],

  isLoading: boolean,
  canFetchMore?: boolean,
) =>
  (data.length === 1 && isEmpty(last(data)) && !canFetchMore) ||
  (!isLoading && data.length === 0)
