import { FC } from 'react'
import { Redirect, useRouteMatch } from 'react-router'

import { Url } from '@revolut/rwa-core-utils'

import { isAppUsageRestricted } from './utils'

export const EXCLUDED_ROUTES = [Url.Error, Url.UnsupportedLocation]

export const UnsupportedLocationRedirect: FC = ({ children }) => {
  const matchExcludedRoute = useRouteMatch(EXCLUDED_ROUTES)

  const shouldRedirect = isAppUsageRestricted() && !matchExcludedRoute

  return shouldRedirect ? <Redirect to={Url.UnsupportedLocation} /> : <>{children}</>
}
