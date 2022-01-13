import { FC } from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'

import { AxiosSecurity, Url } from '@revolut/rwa-core-utils'

import { useAuthContext } from '../../providers'
import { redirectAfterSignIn } from '../../utils'

export const SIGN_IN_ROUTES = [Url.SignIn, Url.RequestScopedToken]

/**
 * Handles `Root`, `Start` and `Sign In` redirects.
 * `Sign In` redirects should be moved to the `Sign In` flow itself as
 * keeping them here is a source of constant errors.
 */
export const StartPageRedirect: FC = ({ children }) => {
  const rootRoute = useRouteMatch(Url.Root)
  const startRoute = useRouteMatch(Url.Start)
  const signInRoute = useRouteMatch(SIGN_IN_ROUTES)

  const {
    beforeStepUpUrl,
    isAuthorized: isAuthAuthorized,
    phoneNumber,
  } = useAuthContext()

  const isStepUp = Boolean(beforeStepUpUrl)
  const isAuthorized = isAuthAuthorized || AxiosSecurity.hasAuth()

  const shouldRedirectToStart = Boolean(
    !isAuthorized &&
      ((signInRoute?.isExact && !isStepUp && !phoneNumber.number) || rootRoute?.isExact),
  )
  const shouldRedirectToHome = Boolean(
    isAuthorized &&
      ((signInRoute?.isExact && !isStepUp) || rootRoute?.isExact || startRoute?.isExact),
  )

  if (shouldRedirectToStart) {
    return <Redirect to={Url.Start} />
  }

  if (shouldRedirectToHome && !redirectAfterSignIn.isUrlSaved()) {
    return <Redirect to={Url.Home} />
  }

  return <>{children}</>
}
