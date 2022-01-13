import { PhoneNumberValue } from '@revolut/rwa-core-types'

import { getPhoneCodeByCountryCode } from './countries'

export const formatPhoneNumber = (phoneNumber: PhoneNumberValue) =>
  `${getPhoneCodeByCountryCode(phoneNumber.code)}${phoneNumber.number}`

export const formatToBase64Image = (imageString: string) => {
  return `data:image/png;base64,${imageString}`
}

export const formatBytesSize = (bytes: number, decimals: number = 0) => {
  const SIZE_EXPONENT_MAP = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (bytes === 0) {
    return '0 Bytes'
  }

  const base = 1024
  const calculatedDecimals = decimals < 0 ? 0 : decimals

  const foundExponent = Math.floor(Math.log(bytes) / Math.log(base))
  const totalBytes = Math.floor(bytes / Math.pow(base, foundExponent))
  const sizeString = totalBytes.toFixed(calculatedDecimals)

  return `${sizeString} ${SIZE_EXPONENT_MAP[foundExponent]}`
}
