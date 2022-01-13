import { sanitize } from 'dompurify'
import { isEmpty } from 'lodash'

import { NewsItemDto } from '@revolut/rwa-core-types'

const TITLE_ANCHOR = '.news-h2'
const DESCRIPTION_ANCHOR = '.news-content'
const FOOTER_ANCHOR = '.news-footer'

export const getIncidentContent = (incident?: NewsItemDto) => {
  if (!incident) {
    return { hasContent: false }
  }

  const el = document.createElement('html')
  el.innerHTML = incident.content

  const title = sanitize(el.querySelector(TITLE_ANCHOR)?.innerHTML || '')
  const description = sanitize(el.querySelector(DESCRIPTION_ANCHOR)?.innerHTML || '')
  const footer = sanitize(el.querySelector(FOOTER_ANCHOR)?.innerHTML || '')

  return {
    title,
    description,
    footer,
    hasContent: !isEmpty(title) && !isEmpty(description),
  }
}
