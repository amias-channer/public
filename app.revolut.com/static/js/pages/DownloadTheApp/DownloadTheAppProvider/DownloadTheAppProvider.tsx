import { createContext, FC, useState } from 'react'

import { PhoneNumberValue } from '@revolut/rwa-core-types'
import { getDefaultPhoneNumberValue } from '@revolut/rwa-core-utils'

import { DownloadTheAppContextType, DownloadTheAppContextInitialValue } from './types'

const EMPTY_DATA = {} as DownloadTheAppContextType

export const DownloadTheAppContext = createContext<DownloadTheAppContextType>(EMPTY_DATA)

export type AuthProviderProps = {
  initialValue?: DownloadTheAppContextInitialValue
}

export const DownloadTheAppProvider: FC<AuthProviderProps> = ({
  initialValue,
  children,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumberValue>(
    initialValue?.phoneNumber ?? getDefaultPhoneNumberValue(),
  )

  const value: DownloadTheAppContextType = {
    phoneNumber,
    setPhoneNumber,
  }

  return (
    <DownloadTheAppContext.Provider value={value}>
      {children}
    </DownloadTheAppContext.Provider>
  )
}
