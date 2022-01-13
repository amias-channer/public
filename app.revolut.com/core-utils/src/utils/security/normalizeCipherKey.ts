import CryptoJS, { WordArray } from 'crypto-js'

import { IS_CYPRESS } from '@revolut/rwa-core-config'

const CIPHER_KEY_SIZE = 32

/**
 * The actual return type should be `string | LibWordArray`, but `crypto-js`
 * typing is not accurate at the moment.
 */
export const normalizeCipherKey = (cipherKey: string): string | WordArray => {
  let formattedCipherKey = cipherKey

  if (!IS_CYPRESS && cipherKey.length < CIPHER_KEY_SIZE) {
    formattedCipherKey = CryptoJS.SHA256(cipherKey).toString(CryptoJS.enc.Hex)
  }

  return CryptoJS.enc.Utf8.parse(formattedCipherKey.slice(0, CIPHER_KEY_SIZE))
}
