import { createContext, FC, useState } from 'react'

import { TopupAmount, UserTopupCardDto } from '@revolut/rwa-core-types'

import { TopUpMethod } from '../constants'
import { TopUpContextType, TopUpProviderProps } from './types'

export const TopUpContext = createContext<TopUpContextType>({} as TopUpContextType)

export const TopUpProvider: FC<TopUpProviderProps> = ({ initialValue, children }) => {
  const [amount, setAmount] = useState<TopupAmount | undefined>(initialValue?.amount)
  const [checkoutExtraAmount, setCheckoutExtraAmount] = useState<
    TopupAmount | undefined
  >()
  const [isAmountValid, setAmountValid] = useState(false)
  const [linkedCard, setLinkedCard] = useState<UserTopupCardDto | undefined>(
    initialValue?.linkedCard,
  )
  const [method, setMethod] = useState<TopUpMethod | undefined>(initialValue?.method)
  const [pocketId, setPocketId] = useState<string>()

  const value: TopUpContextType = {
    amount,
    setAmount,

    checkoutExtraAmount,
    setCheckoutExtraAmount,

    isAmountValid,
    setAmountValid,

    linkedCard,
    setLinkedCard,

    method,
    setMethod,

    pocketId,
    setPocketId,

    allowTopUpGooglePay: initialValue?.allowTopUpGooglePay,
  }

  return <TopUpContext.Provider value={value}>{children}</TopUpContext.Provider>
}
