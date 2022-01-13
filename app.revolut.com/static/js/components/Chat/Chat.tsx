import * as React from 'react'
import * as Sentry from '@sentry/react'

import { SentryTag } from '@revolut/rwa-core-utils'

import { resetFavicon } from 'utils'

import { ChatContainer } from './ChatContainer'

export class Chat extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
      tags: { [SentryTag.Source]: 'ChatWidget' },
    })
  }

  defaultTitle: string = ''

  handleVisibilityChange = () => {
    if (!document.hidden && document.title !== this.defaultTitle) {
      document.title = this.defaultTitle
      resetFavicon()
    }
  }

  componentDidMount() {
    this.defaultTitle = document.title
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }

  render() {
    return <ChatContainer />
  }
}
