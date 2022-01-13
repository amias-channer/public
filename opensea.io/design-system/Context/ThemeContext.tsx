import React, {
  ContextType,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react"
import moment from "moment"
import { useUpdateEffect } from "react-use"
import { ThemeProvider as SCThemeProvider } from "styled-components"
import Cookie from "../../lib/cookie"
import { Theme } from "../../styles/styled"
import THEMES, { THEME_COOKIE_KEY } from "../../styles/themes"

interface ThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => unknown
}

const DEFAULT_CONTEXT: ThemeContext = {
  theme: "light",
  setTheme: () => {},
}

export const ThemeContext = createContext(DEFAULT_CONTEXT)

export type ThemeContextType = ContextType<typeof ThemeContext>

type Props = {
  theme: Theme
  children: React.ReactNode
}

export const ThemeProvider = ({ children, theme: initialTheme }: Props) => {
  const [theme, setTheme] = useState(initialTheme)
  const value = useMemo(() => ({ theme, setTheme }), [theme])

  useUpdateEffect(() => {
    new Cookie(THEME_COOKIE_KEY).set(
      { theme },
      { expires: moment().add(10, "year").toDate() },
    )
  }, [theme])

  return (
    <ThemeContext.Provider value={value}>
      <SCThemeProvider theme={THEMES[theme]}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
