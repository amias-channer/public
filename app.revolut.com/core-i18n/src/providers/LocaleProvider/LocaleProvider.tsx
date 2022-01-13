import { FC, createContext, useState } from 'react'
import { getI18n } from 'react-i18next'

import {
  defaultStorage,
  DefaultStorageKey,
  getCurrentLocale,
} from '@revolut/rwa-core-utils'

import { loadLocaleData } from '../../utils'

type LocaleContextType = {
  locale: string
  setNewLocale: (newLocale: string) => void
}

export const LocaleContext = createContext<LocaleContextType>({
  locale: '',
  setNewLocale: () => {},
})

export const LocaleProvider: FC = ({ children }) => {
  const [locale, setLocale] = useState(getCurrentLocale())
  const i18n = getI18n()

  const setNewLocale = async (newLocale?: string) => {
    if (!newLocale) {
      return
    }
    await loadLocaleData(newLocale)
    await i18n.changeLanguage(newLocale)

    defaultStorage.setItem(DefaultStorageKey.Locale, newLocale)
    setLocale(newLocale)
  }

  return (
    <LocaleContext.Provider value={{ locale, setNewLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
