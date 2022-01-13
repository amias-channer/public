import axios from 'axios'
import * as R from 'ramda'
import { v4 as uuidV4 } from 'uuid'

import chatConfig from '../../config'
import {
  LocalStorage,
  getItemFromLocalStorage,
  setItemToLocalStorage,
} from '../../constants/storage'

const { REQUEST_HEADERS } = chatConfig

export const getRetailFingerprint = () => {
  const parsedFingerprint = getItemFromLocalStorage(
    LocalStorage.CHAT_RETAIL_FINGERPRINT
  )
  return parsedFingerprint?.payload ?? null
}

export const getFingerprint = () => {
  const businessPrint = getItemFromLocalStorage(
    LocalStorage.CHAT_BUSINESS_FINGERPRINT
  )
  const retailPrint = getRetailFingerprint()
  if (!retailPrint && !businessPrint) {
    const fingerprint = uuidV4()
    setItemToLocalStorage(LocalStorage.CHAT_BUSINESS_FINGERPRINT, fingerprint)
    return fingerprint
  }

  return retailPrint || businessPrint
}

const AcceptLanguageRegExp = /([a-z | *]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/i
export const isValidAcceptLanguageHeader = (header: string) => {
  const splitted = header.split(' ').join('').split(',')
  const res = splitted.filter((headerPart) => {
    const matchedAcceptLanguageHeader = headerPart.match(AcceptLanguageRegExp)
    const isProperAcceptLanguageHeader =
      matchedAcceptLanguageHeader &&
      (matchedAcceptLanguageHeader || [])[0] === headerPart
    if (!isProperAcceptLanguageHeader) {
      return true
    }
    return false
  })

  return res.length === 0
}

export const ChatAxios = axios.create()

ChatAxios.interceptors.request.use(
  (config) => {
    if (!config.url || /^https?:\/\//.test(config.url)) {
      return config
    }
    const isSignIn = /\/api\/signin/.test(config.url)

    const acceptLanguageHeader = window.navigator.language

    const headers = R.merge(config.headers, {
      ...(!isSignIn && REQUEST_HEADERS.headers),
      'x-device-id': getFingerprint(),
      'Accept-Language': isValidAcceptLanguageHeader(acceptLanguageHeader)
        ? acceptLanguageHeader
        : 'en-US',
    })

    return R.merge(config, { headers })
  },
  (error) => Promise.reject(error)
)
