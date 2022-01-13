import { useMemo } from 'react'

import { useQueryWallet } from '@revolut/rwa-core-api'
import { checkIfIsRegularPocket, checkRequired } from '@revolut/rwa-core-utils'

export const useGetCurrentPocket = (requiredCurrency?: string) => {
  const { data: walletData } = useQueryWallet()

  return useMemo(() => {
    if (!walletData || !requiredCurrency) {
      return null
    }

    const validPockets = walletData.pockets.filter(checkIfIsRegularPocket)
    return checkRequired(
      validPockets.find((pocket) => pocket.currency === requiredCurrency),
      '"currentPocket" can not be empty',
    )
  }, [requiredCurrency, walletData])
}
