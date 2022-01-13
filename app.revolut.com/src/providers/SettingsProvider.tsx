import React, { FC, createContext, useContext } from 'react'

export type SettingsState = {
  isDisplayStartNewChatButtonForAuthenticatedUsers: boolean
  isDexter: boolean
  transformContent: (content: string, type: 'message' | 'banner') => string
}

export const SettingsContext = createContext<SettingsState>({
  isDisplayStartNewChatButtonForAuthenticatedUsers: false,
  isDexter: false,
  transformContent: (content) => content,
})

export const SettingsProvider: FC<{ settings: SettingsState }> = ({
  settings,
  children,
}) => (
  <SettingsContext.Provider value={settings}>
    {children}
  </SettingsContext.Provider>
)

export const useSettings = () => useContext(SettingsContext)
