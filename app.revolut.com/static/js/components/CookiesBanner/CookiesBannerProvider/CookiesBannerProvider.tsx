import { createContext, FC, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'

import { Url } from '@revolut/rwa-core-utils'

import { CookiesBannerContextType } from './types'

export const CookiesBannerContext = createContext<CookiesBannerContextType>(
  {} as CookiesBannerContextType,
)

const COOKIES_EXCEPTION_ROUTES = [Url.RequestScopedToken]

export const CookiesBannerProvider: FC = ({ children }) => {
  const [isHidden, setIsHidden] = useState(false)
  const matchExcludedRoute = useRouteMatch(COOKIES_EXCEPTION_ROUTES)

  useEffect(() => {
    if (!matchExcludedRoute) {
      setIsHidden(false)
    }
  }, [matchExcludedRoute])

  const value: CookiesBannerContextType = {
    isHidden,
    setIsHidden,
  }

  return (
    <CookiesBannerContext.Provider value={value}>
      {children}
    </CookiesBannerContext.Provider>
  )
}
