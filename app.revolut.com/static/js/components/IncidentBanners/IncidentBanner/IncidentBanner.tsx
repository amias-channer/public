import { FC, useState, SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ExclamationTriangle as ExclamationTriangleIcon,
  Cross as CrossIcon,
} from '@revolut/icons'
import { Card, Media, TextBox } from '@revolut/ui-kit'

import { NewsItemDto } from '@revolut/rwa-core-types'
import { secureStorage, SecureStorageKey, getIncidentUrl } from '@revolut/rwa-core-utils'

import { getIncidentContent } from 'utils'

import { IconBackground, CloseBannerWrapper } from './styled'

export const CLOSE_BANNER_BUTTON_TESTID = 'close-banner-button-testid'
export const INCIDENT_BANNER_TESTID = 'incident-banner'
export const INCIDENT_BANNER_LINK_TESTID = 'incident-banner-link'

type Props = {
  incident: NewsItemDto
}

export const IncidentBanner: FC<Props> = ({ incident }) => {
  const { id, title, description, closeable } = incident
  const hiddenIncidentBanners =
    secureStorage.getItem<string[]>(SecureStorageKey.HiddenIncidentBanners) || []

  const [isBannerHidden, setIsBannerHidden] = useState(hiddenIncidentBanners.includes(id))

  const hideBanner = (e: SyntheticEvent) => {
    e.preventDefault()
    secureStorage.setItem(SecureStorageKey.HiddenIncidentBanners, [
      ...hiddenIncidentBanners,
      id,
    ])
    setIsBannerHidden(true)
  }

  const { hasContent } = getIncidentContent(incident)

  if (isBannerHidden) {
    return null
  }

  const banner = (
    <Card
      py={{ md: 'px20', _: 'px16' }}
      px={{ md: 'px28', _: 'px16' }}
      variant="plain"
      mb="px16"
      data-testid={INCIDENT_BANNER_TESTID}
    >
      <Media>
        <Media.Side>
          <IconBackground>
            <ExclamationTriangleIcon color="warning" />
          </IconBackground>
        </Media.Side>
        <Media.Content ml={{ md: 'px20', _: 'px16' }}>
          <TextBox ellipsis variant="primary" fontWeight="bolder">
            {title}
          </TextBox>
          <TextBox variant="secondary" color="grey-50" mt="px4">
            {description}
          </TextBox>
        </Media.Content>
        {closeable && (
          <Media.Side>
            <CloseBannerWrapper onClick={hideBanner}>
              <CrossIcon
                color="incidentBannerCloseIcon"
                data-testid={CLOSE_BANNER_BUTTON_TESTID}
              />
            </CloseBannerWrapper>
          </Media.Side>
        )}
      </Media>
    </Card>
  )

  if (!hasContent) {
    return banner
  }

  return (
    <Link to={getIncidentUrl(id)} data-testid={INCIDENT_BANNER_LINK_TESTID}>
      {banner}
    </Link>
  )
}
