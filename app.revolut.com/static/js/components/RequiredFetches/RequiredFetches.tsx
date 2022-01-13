import { FC, useState, useEffect } from 'react'

import { useAuthContext } from '@revolut/rwa-core-auth'
import { useUpdateCurrenciesList } from '@revolut/rwa-core-api'

export const RequiredFetches: FC = ({ children }) => {
  const { isAuthorized } = useAuthContext()
  const [isReady, setIsReady] = useState(false)

  const { isAttemptToUpdateComplete } = useUpdateCurrenciesList(isAuthorized)

  useEffect(() => {
    if (isReady) {
      return
    }

    if (!isAuthorized || (isAuthorized && isAttemptToUpdateComplete)) {
      setIsReady(true)
      return
    }

    setIsReady(false)
  }, [isAttemptToUpdateComplete, isAuthorized, isReady])

  return isReady ? <>{children}</> : null
}
