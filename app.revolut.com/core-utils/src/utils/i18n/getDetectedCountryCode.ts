import { RwaNginxCookieName } from '../constants'
import { cookieStorage } from '../storage'

export const getDetectedCountryCode = () =>
  cookieStorage.getItem(RwaNginxCookieName.GeoCountry)
