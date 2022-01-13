import { Pocket, WalletDto } from '@revolut/rwa-core-types'

import { ALL_ACCOUNTS_ID } from '../../constants'

export const getSelectedPocket = (
  wallet?: WalletDto,
  selectedAccountId?: string | null,
) => wallet?.pockets?.find((pocket: Pocket) => pocket.id === selectedAccountId)

export const getPocketId = (selectedAccountId?: string, selectedPocket?: Pocket) => {
  if (selectedAccountId === ALL_ACCOUNTS_ID || !selectedPocket) {
    return undefined
  }
  return selectedPocket.id
}

export const getCurrency = (
  wallet?: WalletDto,
  selectedPocket?: Pocket,
  selectedAccountId?: string,
) => {
  if (selectedAccountId === ALL_ACCOUNTS_ID && wallet) {
    return wallet.baseCurrency
  }

  return (selectedPocket && selectedPocket.currency) || null
}
