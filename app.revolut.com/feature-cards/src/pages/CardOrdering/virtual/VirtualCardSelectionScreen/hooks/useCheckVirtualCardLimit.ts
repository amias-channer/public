import { VirtualCardDesignDto } from '@revolut/rwa-core-types'

import { useCheckCardLimit } from '../../../hooks'

export const useCheckVirtualCardLimit = (cardDesign?: VirtualCardDesignDto) => {
  const params = cardDesign
    ? {
        design: cardDesign.code,
      }
    : undefined

  return useCheckCardLimit(params)
}
