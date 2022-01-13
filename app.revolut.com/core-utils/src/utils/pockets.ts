import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import {
  Pocket,
  PocketOrigin,
  PocketType,
  RevolutBankAccount,
} from '@revolut/rwa-core-types'

export const checkIfIsRegularPocket = (pocket: Pocket) => {
  const isFiatCurrency = Object.keys(getConfigValue(ConfigKey.Currencies)).includes(
    pocket.currency,
  )
  const isSavings = pocket.type === PocketType.Savings
  const isCredit = pocket.type === PocketType.Credit
  const isLinked = pocket?.origin === PocketOrigin.External

  return !isSavings && !isCredit && !isLinked && isFiatCurrency
}

export const getAccountDetailsForPocket = (
  pocket?: Pocket,
  accounts?: RevolutBankAccount[],
) => {
  return accounts && pocket
    ? accounts.filter((account: RevolutBankAccount) => {
        const doesCurrencyMatch = account.currency === pocket.currency
        const isActivated = !(account.activate === true && account.kycRequired === true)

        return doesCurrencyMatch && isActivated
      })
    : []
}
