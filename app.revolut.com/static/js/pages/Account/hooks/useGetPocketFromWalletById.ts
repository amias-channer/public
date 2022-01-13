import { useMemo } from 'react'

import { useQueryWallet } from '@revolut/rwa-core-api'
import { Pocket } from '@revolut/rwa-core-types'

import { getPocketFromWalletById } from '../helpers'

export const useGetPocketFromWalletById = (pocketId?: string): Pocket | undefined => {
  const { data: wallet } = useQueryWallet()

  return useMemo(() => getPocketFromWalletById(wallet, pocketId), [pocketId, wallet])
}
