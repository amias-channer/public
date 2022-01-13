import { createContext, FC, useState } from 'react'
import { CryptoExchangeParams } from '../../types'

type ExchangeContext = {
  cryptoExchangeParams?: CryptoExchangeParams
  setCryptoExchangeParams: (state: CryptoExchangeParams) => void
}

export const CryptoExchangeContext = createContext<ExchangeContext>({} as ExchangeContext)

export const CryptoExchangeProvider: FC = ({ children }) => {
  const [cryptoExchangeParams, setCryptoExchangeParams] = useState<CryptoExchangeParams>()

  return (
    <CryptoExchangeContext.Provider
      value={{ cryptoExchangeParams, setCryptoExchangeParams }}
    >
      {children}
    </CryptoExchangeContext.Provider>
  )
}
