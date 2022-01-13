import { Pocket, Wallet, UUID } from '@revolut/rwa-core-types'

export const getPocketFromWalletById = (wallet?: Wallet, pocketId?: UUID) => {
  return wallet?.pockets?.find((pocket: Pocket) => pocket.id === pocketId)
}
