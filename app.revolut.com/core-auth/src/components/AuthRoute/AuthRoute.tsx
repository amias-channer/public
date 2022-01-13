import { FC, useEffect } from 'react'
import {
  Route,
  RouteProps,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom'

import { FullPageLoader } from '@revolut/rwa-core-components'
import { AxiosSecurity, isRestrictedAccessToken, Url } from '@revolut/rwa-core-utils'

import { useAuthContext } from '../../providers'
import { redirectAfterSignIn } from '../../utils'
import { useTryToPerformStepUp } from './useTryToPerformStepUp'

const composeUrl = (pathname: string, search: string, hash: string) =>
  `${pathname}${search}${hash}`

type AuthRouteProps = RouteProps & {
  isFullAccessRequired?: boolean
}

export const AuthRoute: FC<AuthRouteProps> = ({ isFullAccessRequired, ...restProps }) => {
  const history = useHistory()
  const location = useLocation()
  const currentRoute = useRouteMatch(restProps)

  const { user, isAuthorized: isAuthAuthorized } = useAuthContext()

  const tryToPerformStepUp = useTryToPerformStepUp(
    user?.phone,
    currentRoute
      ? composeUrl(currentRoute.url, location.search, location.hash)
      : undefined,
  )

  const isAuthorized = isAuthAuthorized || AxiosSecurity.hasAuth()
  const shouldRedirectToStart = !isAuthorized
  const shouldTryToPerformStepUp = Boolean(
    isAuthorized && isFullAccessRequired && isRestrictedAccessToken(),
  )

  useEffect(() => {
    if (shouldRedirectToStart) {
      redirectAfterSignIn.saveUrl()

      history.push(Url.Start)
    }

    if (shouldTryToPerformStepUp) {
      tryToPerformStepUp()
    }
  }, [history, shouldRedirectToStart, shouldTryToPerformStepUp, tryToPerformStepUp])

  if (shouldRedirectToStart || shouldTryToPerformStepUp) {
    return <FullPageLoader />
  }

  return <Route {...restProps} />
}
