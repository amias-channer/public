import { useMemo } from 'react'

import { DEFAULT_AVAILABLE_CURRENCIES, useQueryUserConfig } from '@revolut/rwa-core-api'

export const useGetSupportedHoldingCurrencies = () => {
  const [userConfig] = useQueryUserConfig()

  return useMemo(
    () => userConfig?.walletCurrencies ?? DEFAULT_AVAILABLE_CURRENCIES,
    [userConfig],
  )
}
