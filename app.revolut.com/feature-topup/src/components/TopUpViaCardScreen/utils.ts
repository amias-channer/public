import isNil from 'lodash/isNil'
import isString from 'lodash/isString'

import { AddressDto } from '@revolut/rwa-core-types'
import { browser } from '@revolut/rwa-core-utils'

import { NormalizedAddress } from './types'

// This constants are required for Mall integration to work properly.
const MALL_BROWSER_COLOR_DEPTH = 24
const MALL_BROWSER_TZ_UTC_OFFSET_MINS = -180

export const submitFormToIframe = (
  target: string,
  action: string,
  fields: Record<string, string | boolean | number | undefined>,
) => {
  const form = document.createElement('form')

  form.setAttribute('method', 'post')
  form.setAttribute('action', action)
  form.setAttribute('target', target)

  form.style.display = 'none'

  Object.entries(fields).forEach(([key, value]) => {
    if (isNil(value)) {
      return
    }

    const inputElement = document.createElement('input')

    inputElement.setAttribute('type', 'text')
    inputElement.setAttribute('name', key)
    inputElement.setAttribute('value', String(value))

    form.appendChild(inputElement)
  })

  document.body.appendChild(form)

  form.submit()
}

export const normalizeAddress = (address: AddressDto) => {
  const parts = [
    address.country,
    address.region,
    address.city,
    address.postcode,
    address.streetLine1,
    address.streetLine2,
  ].map((part) => (isString(part) ? part.trim() : ''))

  return parts.join('|') as NormalizedAddress
}

export const getMallBrowserFingerprint = () => {
  const browserFingerprint = browser.getFingerprint()

  return {
    screen_width: browserFingerprint.browserScreenWidth,
    screen_height: browserFingerprint.browserScreenHeight,
    challenge_window_width: browserFingerprint.challengeWindowWidth,
    color_depth: MALL_BROWSER_COLOR_DEPTH,
    tz_utc_offset_mins: MALL_BROWSER_TZ_UTC_OFFSET_MINS,
  }
}
