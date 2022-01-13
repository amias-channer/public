import { useEffect, useMemo } from 'react'

import {
  useDefaultStorage,
  DefaultStorageKey,
  findCurrentActivePocketByCurrency,
} from '@revolut/rwa-core-utils'
import { useAuthContext } from '@revolut/rwa-core-auth'
import { useQueryWallet } from '@revolut/rwa-core-api'
import { Currency } from '@revolut/rwa-core-config'

import { DEFAULT_TARGET_CURRENCY } from '../../constants'

export const useCryptoTargetCurrency = () => {
  const [targetCurrency, setTargetCurrency] = useDefaultStorage<Currency | null>(
    DefaultStorageKey.CryptoTargetCurrency,
    null,
  )

  const { isAuthorized } = useAuthContext()
  const { data: wallet, status: walletQueryStatus } = useQueryWallet({
    enabled: isAuthorized,
  })

  const userPockets = useMemo(() => wallet?.pockets ?? [], [wallet?.pockets])

  const defaultPocket = findCurrentActivePocketByCurrency(
    userPockets,
    DEFAULT_TARGET_CURRENCY,
  )

  useEffect(() => {
    if (walletQueryStatus !== 'success' || !wallet) {
      return
    }

    if (targetCurrency) {
      const targetPocket = findCurrentActivePocketByCurrency(userPockets, targetCurrency)

      if (targetPocket) {
        return
      }
    }
    setTargetCurrency(wallet.baseCurrency)
  }, [setTargetCurrency, targetCurrency, userPockets, wallet, walletQueryStatus])

  const availableTargetCurrencies = useMemo(() => {
    if (walletQueryStatus !== 'success' || !wallet) {
      return []
    }

    if (defaultPocket) {
      return [DEFAULT_TARGET_CURRENCY, wallet.baseCurrency]
    }

    return [wallet.baseCurrency]
  }, [defaultPocket, wallet, walletQueryStatus])

  return {
    availableTargetCurrencies,
    targetCurrency: targetCurrency ?? DEFAULT_TARGET_CURRENCY,
    setTargetCurrency,
  }
}
