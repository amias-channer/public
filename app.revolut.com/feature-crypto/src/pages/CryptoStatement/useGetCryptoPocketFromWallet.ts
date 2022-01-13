import { useMemo } from 'react'

import { useQueryWallet } from '@revolut/rwa-core-api'
import { Pocket } from '@revolut/rwa-core-types'

export const useGetCryptoPocketFromWallet = (cryptoCode: string): Pocket | undefined => {
  const { data: wallet } = useQueryWallet()

  return useMemo(
    () => wallet?.pockets?.find((pocket: Pocket) => pocket.currency === cryptoCode),
    [cryptoCode, wallet?.pockets],
  )
}
