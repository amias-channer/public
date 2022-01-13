import { FC, createContext } from 'react'

import { Currency } from '@revolut/rwa-core-types'

import { DEFAULT_TARGET_CURRENCY } from '../../constants'
import { useCryptoTargetCurrency } from '../../hooks'

type CryptoContextType = {
  targetCurrency: string
  setTargetCurrency: (newCurrency: Currency) => void
  availableTargetCurrencies: Currency[]
}

export const CryptoContext = createContext<CryptoContextType>({
  targetCurrency: DEFAULT_TARGET_CURRENCY,
  setTargetCurrency: () => {},
  availableTargetCurrencies: [DEFAULT_TARGET_CURRENCY],
})

export const CryptoProvider: FC = ({ children }) => {
  const { availableTargetCurrencies, targetCurrency, setTargetCurrency } =
    useCryptoTargetCurrency()

  return (
    <CryptoContext.Provider
      value={{ targetCurrency, setTargetCurrency, availableTargetCurrencies }}
    >
      {children}
    </CryptoContext.Provider>
  )
}
