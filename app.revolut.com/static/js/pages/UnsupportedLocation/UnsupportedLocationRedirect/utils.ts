import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'
import {
  RwaNginxCookieName,
  cookieStorage,
  getDetectedCountryCode,
} from '@revolut/rwa-core-utils'

type BlacklistedRegion = {
  name: string
  geoId: string
}

export const isAppUsageRestricted = () => {
  const userCountryCode = getDetectedCountryCode() || ''
  const userRegionGeoId = cookieStorage.getItem(RwaNginxCookieName.GeoRegionId)

  const blacklistedCountries = getConfigValue<string[]>(ConfigKey.BlacklistedCountries)
  const blacklistedRegions = getConfigValue<BlacklistedRegion[]>(
    ConfigKey.BlacklistedRegions,
  )

  if (!userCountryCode && !userRegionGeoId) {
    return false
  }

  return (
    blacklistedCountries.includes(userCountryCode) ||
    blacklistedRegions.some((region) => region.geoId === userRegionGeoId)
  )
}
