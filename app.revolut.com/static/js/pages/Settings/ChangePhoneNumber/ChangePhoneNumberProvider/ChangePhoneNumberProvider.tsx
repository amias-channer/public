import { createContext, FC, useState } from 'react'

import { ChangePhoneNumberContextType, ChangePhoneNumberProviderProps } from './types'

export const ChangePhoneNumberContext = createContext<ChangePhoneNumberContextType>(
  {} as ChangePhoneNumberContextType,
)

export const ChangePhoneNumberProvider: FC<ChangePhoneNumberProviderProps> = ({
  initialValue,
  children,
}) => {
  const [newPhone, setNewPhone] = useState(initialValue?.newPhone ?? '')
  const [currentPhoneOtp, setCurrentPhoneOtp] = useState('')

  const value: ChangePhoneNumberContextType = {
    newPhone,
    setNewPhone,

    currentPhoneOtp,
    setCurrentPhoneOtp,
  }

  return (
    <ChangePhoneNumberContext.Provider value={value}>
      {children}
    </ChangePhoneNumberContext.Provider>
  )
}
