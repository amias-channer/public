const INCIDENT_BANNER_WIDTH = 368

export const getIncidentBannerWidth = (length: number) => {
  if (length === 1) {
    return '100%'
  }

  return INCIDENT_BANNER_WIDTH
}
