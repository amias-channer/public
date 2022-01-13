import axios from 'axios'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import {
  CheckoutComTokenRequestDto,
  CheckoutComTokenResponseDto,
} from '@revolut/rwa-core-types'

const checkoutComApi = axios.create({
  baseURL: getConfigValue(ConfigKey.CheckoutComApi),
  headers: {},
})

type GetCheckoutComTokenArgs = { publicKey: string; data: CheckoutComTokenRequestDto }

export const getCheckoutComToken = ({ publicKey, data }: GetCheckoutComTokenArgs) =>
  checkoutComApi.post<CheckoutComTokenResponseDto>('/tokens', data, {
    headers: {
      authorization: publicKey,
    },
  })
