import { createContext, useState, FC } from 'react'

type TransactionsScrollingContextType = {
  shouldAutoScrollToTransactionBeUsed: boolean
  setShouldAutoScrollToTransactionBeUsed: (value: boolean) => void
}

export const TransactionsScrollingContext =
  createContext<TransactionsScrollingContextType>({
    shouldAutoScrollToTransactionBeUsed: true,
    setShouldAutoScrollToTransactionBeUsed: () => {},
  })

export const TransactionsScrollingContextProvider: FC = ({ children }) => {
  const [shouldAutoScrollToTransactionBeUsed, setShouldAutoScrollToTransactionBeUsed] =
    useState<boolean>(true)

  return (
    <TransactionsScrollingContext.Provider
      value={{
        shouldAutoScrollToTransactionBeUsed,
        setShouldAutoScrollToTransactionBeUsed,
      }}
    >
      {children}
    </TransactionsScrollingContext.Provider>
  )
}
