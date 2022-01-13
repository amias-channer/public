import { UserConfigMap } from '@revolut/rwa-core-api'

import { TopUpMethod } from '../../constants'

export const getAvailableTopUpMethodsForCurrency = (
  currencyCode: string,
  userConfig: UserConfigMap,
) => {
  const availableMethods: TopUpMethod[] = []

  if (userConfig.topupBankTransferCurrencies.includes(currencyCode)) {
    availableMethods.push(TopUpMethod.RegularBankTransfer)
  }

  if (userConfig.topupCardCurrencies.includes(currencyCode)) {
    availableMethods.push(TopUpMethod.DebitOrCreditCard)
  }

  if (userConfig.topupApplePayCurrencies.includes(currencyCode)) {
    availableMethods.push(TopUpMethod.ApplePay)
  }

  if (userConfig.topupGooglePayCurrencies.includes(currencyCode)) {
    availableMethods.push(TopUpMethod.GooglePay)
  }

  // "topupDefaultMethod" is a constant right now:
  // revolut-server/retail/config-app/src/main/java/com/revolut/retail/config/client/ClientConfig.java#topUpDefaultMethod
  const defaultMethod =
    userConfig.topupDefaultMethod === 'card' &&
    availableMethods.includes(TopUpMethod.DebitOrCreditCard)
      ? TopUpMethod.DebitOrCreditCard
      : TopUpMethod.RegularBankTransfer

  return { defaultMethod, availableMethods }
}
