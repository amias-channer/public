import * as Sentry from '@sentry/react'
import { SentryTag, buildSentryContext, DEFAULT_LOCALE } from '@revolut/rwa-core-utils'

import { getTroubleshootFeed, getFAQs } from 'api'

export const getTroubleshoots = async (language = DEFAULT_LOCALE) => {
  try {
    const faq = await getFAQs(language)
    const feed = await getTroubleshootFeed()
    const faqFeed = feed
      .filter((feedItem) => feedItem.type === 'FAQ')
      .map((feedItem) => feedItem.payload.key)
    return faq
      .filter((faqItem) => faqFeed.includes(faqItem.key))
      .map((faqItem) => faqItem.title)
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        [SentryTag.Context]: buildSentryContext(['chat', 'troubleshooting']),
      },
    })
    return []
  }
}
