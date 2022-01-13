import { useQuery } from 'react-query'

import { CardsMaxActiveCount, UserConfigResponseDto } from '@revolut/rwa-core-types'
import { QueryKey } from '@revolut/rwa-core-utils'

import { getUserConfig } from '../../api'

/**
 * Hardcoded, taken from Android app default values:
 * https://bitbucket.org/revolut/revolut-android/src/development/app_retail/data/src/main/java/com/revolut/data/network/models/config/mapper/ConfigModelMapper.kt (availableCurrencies())
 */
export const DEFAULT_AVAILABLE_CURRENCIES = ['GBP', 'EUR', 'USD', 'PLN', 'CHF']

export type UserConfigMap = {
  topupMinAmount: Record<string, number>
  topupBankTransferCurrencies: string[]
  topupCardCurrencies: string[]
  topupCardSupportedCardTypes: string[]
  topupDefaultMethod: string
  topupApplePayCurrencies: string[]
  topupGooglePayCurrencies: string[]
  insuranceShowIntermediationText?: boolean
  walletCurrencies: string[]
  cardMaxActiveCount: CardsMaxActiveCount
}

const userConfigMapper = (configData: UserConfigResponseDto): UserConfigMap => ({
  topupMinAmount: configData['topup.min_amount'],
  topupBankTransferCurrencies: configData['topup.bank_transfer.currencies'],
  topupCardCurrencies: configData['topup.card.currencies'],
  topupCardSupportedCardTypes: configData['topup.card.supported_card_types'],
  topupDefaultMethod: configData['topup.default_method'],
  topupApplePayCurrencies: configData['topup.apple_pay.currencies'],
  topupGooglePayCurrencies: configData['topup.google_pay.currencies'],
  insuranceShowIntermediationText: configData['insurance.show_intermediation_text'],
  walletCurrencies: configData['wallet.currencies'] ?? DEFAULT_AVAILABLE_CURRENCIES,
  cardMaxActiveCount: configData['card.max_active_count'],
})

export const useQueryUserConfig = (): [UserConfigMap | undefined, boolean] => {
  const { data, isFetching } = useQuery(QueryKey.UserConfig, getUserConfig, {
    staleTime: Infinity,
  })

  return [data ? userConfigMapper(data) : undefined, isFetching]
}
