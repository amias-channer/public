import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import * as Sentry from '@sentry/react'

import { buildSentryContext, SentryTag, getErrorUrl } from '../../utils'

export const useNavigateToErrorPage = () => {
  const history = useHistory()

  return useCallback(
    (error: string | AxiosError) => {
      const eventId = Sentry.captureException(error, {
        tags: {
          [SentryTag.Context]: buildSentryContext(['navigate to error page hook']),
        },
      })

      history.push(getErrorUrl(eventId))
    },
    [history],
  )
}
