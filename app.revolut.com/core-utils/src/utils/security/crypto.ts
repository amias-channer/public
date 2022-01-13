import CryptoJS from 'crypto-js'

import { secureStorage, SecureStorageKey } from '../storage'
import { checkRequired } from '../checkRequired'
import { normalizeCipherKey } from './normalizeCipherKey'

/**
 * @deprecated
 */
const getAccessToken = () =>
  checkRequired(
    secureStorage.getItem<string>(SecureStorageKey.AuthPassword),
    '"accessToken" can not be empty',
  )

export const decryptImage = (image: string, cipherKey?: string) => {
  return CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(image),
    },
    normalizeCipherKey(cipherKey ?? getAccessToken()),
    {
      mode: CryptoJS.mode.ECB,
    },
  ).toString(CryptoJS.enc.Base64)
}

export const decryptText = (pan: string, cipherKey?: string): string => {
  return CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(pan),
    },
    normalizeCipherKey(cipherKey ?? getAccessToken()),
    {
      mode: CryptoJS.mode.ECB,
    },
  ).toString(CryptoJS.enc.Utf8)
}

export const encryptText = (text: string, cipherKey?: string): string => {
  return CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(text),
    normalizeCipherKey(cipherKey ?? getAccessToken()),
    {
      mode: CryptoJS.mode.ECB,
    },
  ).toString()
}
