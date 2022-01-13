import axios from 'axios'

import {
  CryptoHoldingsDto,
  CryptoDetailsDto,
  CryptoCurrencyConfigDto,
} from '@revolut/rwa-core-types'

export const fetchCryptoHoldings = async (userId: string) => {
  const { data } = await axios.get<CryptoHoldingsDto>(
    `/retail/trading/users/${userId}/positions/crypto`,
  )
  return data
}

export const fetchCryptoDetails = async (cryptoCode: string) => {
  const { data } = await axios.get<CryptoDetailsDto>(
    `/retail/instruments/crypto/${cryptoCode}/details`,
  )
  return data
}

export const fetchCryptoCurrenciesConfig = async () => {
  const { data } = await axios.get<CryptoCurrencyConfigDto>(
    '/retail/config/crypto-currencies',
  )
  return data
}
