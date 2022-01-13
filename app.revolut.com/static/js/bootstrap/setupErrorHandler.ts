import * as Sentry from '@sentry/react'

import { buildSentryContext, SentryTag } from '@revolut/rwa-core-utils'

export const setupErrorHandler = () => {
  window.addEventListener('unhandledrejection', (e) => {
    Sentry.captureException(e, {
      tags: {
        [SentryTag.Context]: buildSentryContext([
          'window',
          'unhandled rejection handler',
        ]),
      },
    })

    e.preventDefault()
  })
}
