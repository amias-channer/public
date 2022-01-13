import { useState } from 'react'

import { ExclamationTriangle, IconComponentType } from '@revolut/icons'
import { useEntryPoint } from '@revolut/rwa-feature-source-of-wealth'
import {
  getIncidentUrl,
  openUrlInNewTab,
  secureStorage,
  SecureStorageKey,
} from '@revolut/rwa-core-utils'
import { NewsItemDto, UUID } from '@revolut/rwa-core-types'

import { useIncidents } from 'hooks'
import { getIncidentContent } from 'utils'

type Incident = {
  iconComponent: IconComponentType
  isLoading: boolean
  onClick: VoidFunction
  onClose: VoidFunction
} & NewsItemDto

export const useHomeBanners = () => {
  const hiddenIncidentBanners =
    secureStorage.getItem<string[]>(SecureStorageKey.HiddenIncidentBanners) || []

  const [hiddenBanners, setHiddenBanners] = useState(hiddenIncidentBanners)
  const { incidents, isLoading } = useIncidents()
  const sowEntryPoint = useEntryPoint()

  const handleHideBanner = (id: UUID) => {
    const newHiddenBanners = [...hiddenIncidentBanners, id]
    secureStorage.setItem(SecureStorageKey.HiddenIncidentBanners, newHiddenBanners)
    setHiddenBanners(newHiddenBanners)
  }

  const incidentBanners = incidents
    .map((incident) => {
      const { hasContent } = getIncidentContent(incident)

      const handleClick = () => {
        openUrlInNewTab(getIncidentUrl(incident.id))
      }

      if (hiddenBanners.includes(incident.id)) {
        return null
      }

      return {
        ...incident,
        iconComponent: ExclamationTriangle,
        isLoading,
        onClick: hasContent ? handleClick : undefined,
        onClose: handleHideBanner,
      }
    })
    .filter(Boolean)

  const additionalBanners = [sowEntryPoint]
    .map((banner) => {
      if (!banner || hiddenBanners.includes(banner.id)) {
        return null
      }

      return {
        ...banner,
        onClose: handleHideBanner,
      }
    })
    .filter(Boolean)

  return {
    incidentBanners: incidentBanners as Incident[],
    additionalBanners,
    isLoading,
  }
}
