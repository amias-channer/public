import axios from 'axios'
import { CurrencyDto, CurrencyType } from '@revolut/rwa-core-types'

export const fetchAvailableCurrencies = async (currencyType: CurrencyType) => {
  const { data } = await axios.get<CurrencyDto[]>(`/retail/currencies`, {
    params: {
      type: currencyType,
    },
  })

  return data
}
