import { UserAuthFlowElementDto } from '@revolut/rwa-core-types'

export const getAccountSimilarity = (data: ReadonlyArray<UserAuthFlowElementDto>) =>
  data?.[0]?.accountSimilarity
