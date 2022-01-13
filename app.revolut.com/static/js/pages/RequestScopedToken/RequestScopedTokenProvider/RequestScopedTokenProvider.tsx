import { createContext, FC, useState } from 'react'

import { RequestScopedTokenContextType, RequestScopedTokenProviderProps } from './types'

export const RequestScopedTokenContext = createContext<RequestScopedTokenContextType>(
  {} as RequestScopedTokenContextType,
)

export const RequestScopedTokenProvider: FC<RequestScopedTokenProviderProps> = ({
  initialValue,
  children,
}) => {
  const [selfie, setSelfie] = useState<string | undefined>(initialValue?.selfie)

  const value: RequestScopedTokenContextType = {
    selfie,
    setSelfie,
  }

  return (
    <RequestScopedTokenContext.Provider value={value}>
      {children}
    </RequestScopedTokenContext.Provider>
  )
}
