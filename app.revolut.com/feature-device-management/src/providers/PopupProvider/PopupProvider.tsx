import React, { createContext, FC, ReactNode, useState } from 'react'
import noop from 'lodash/noop'

export const PopupContext = createContext<{
  popup: ReactNode | null
  setPopup: (popup: ReactNode | null) => void
}>({
  popup: null,
  setPopup: noop,
})

export const PopupContextProvider: FC = ({ children }) => {
  const [popup, setPopup] = useState<ReactNode | null>(null)

  return (
    <PopupContext.Provider
      value={{
        popup,
        setPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  )
}
