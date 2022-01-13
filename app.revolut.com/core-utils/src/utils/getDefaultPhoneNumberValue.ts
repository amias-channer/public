import { COUNTRIES } from './constants'
import { getDetectedCountryCode } from './i18n'

export const getDefaultPhoneNumberValue = () => {
  const detectedCountryCode = getDetectedCountryCode()
  const defaultCountryCode =
    detectedCountryCode && COUNTRIES[detectedCountryCode] ? detectedCountryCode : ''

  return {
    code: defaultCountryCode,
    number: '',
  }
}
