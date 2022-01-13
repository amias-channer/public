import { useMemo } from 'react'

import { useQueryUserConfig } from '@revolut/rwa-core-api'

export const useGetInsuranceCoverCurrency = () => {
  const [userConfig] = useQueryUserConfig()

  return useMemo(() => {
    const isUKEntity = userConfig?.insuranceShowIntermediationText
    return isUKEntity ? 'GBP' : 'EUR'
  }, [userConfig])
}
