import { FC } from 'react'
import { isEmpty } from 'lodash'

import { Carousel, Box } from '@revolut/ui-kit'

import { IncidentBanner } from './IncidentBanner'
import { IncidentBanner as IncidentBannerNew } from './IncidentBannerNew'
import { useHomeBanners } from './hooks'
import { getIncidentBannerWidth } from './utils'

type IncidentBannersProps = {
  showNewBanner?: boolean
}

export const IncidentBanners: FC<IncidentBannersProps> = ({ showNewBanner = false }) => {
  const { incidentBanners, additionalBanners } = useHomeBanners()

  const banners = [...incidentBanners, ...additionalBanners]
  const bannerWidth = getIncidentBannerWidth(banners.length)

  if (isEmpty(banners)) {
    return null
  }

  return (
    <>
      {showNewBanner ? (
        <Carousel>
          {incidentBanners.map(({ isLoading, closeable, id, ...restBanner }) => (
            <Carousel.Item key={id} width={bannerWidth}>
              <IncidentBannerNew
                isCloseble={closeable}
                id={id}
                maxDescriptionLines={2}
                {...restBanner}
              />
            </Carousel.Item>
          ))}

          {additionalBanners.map((banner) => {
            if (!banner) {
              return null
            }

            const { id, isLoading, ...restBanner } = banner

            return (
              <Carousel.Item key={id} width={bannerWidth}>
                <IncidentBannerNew
                  id={id}
                  isCloseble
                  maxDescriptionLines={2}
                  {...restBanner}
                />
              </Carousel.Item>
            )
          })}
        </Carousel>
      ) : (
        incidentBanners.map((incident) => (
          <IncidentBanner key={incident.id} incident={incident} />
        ))
      )}

      <Box mb="s-16" />
    </>
  )
}
