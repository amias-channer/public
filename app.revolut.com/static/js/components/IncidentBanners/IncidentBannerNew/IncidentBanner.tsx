import { FC } from 'react'

import { Banner, BannerSkeleton, LineClamp, Avatar } from '@revolut/ui-kit'
import { IconComponentType } from '@revolut/icons'

import { UUID } from '@revolut/rwa-core-types'

export const INCIDENT_BANNER_TESTID = 'incident-banner-link'
export const CLOSE_BANNER_BUTTON_TESTID = 'close-banner-button-testid'
const AVATAR_SIZE = 56

type IncidentBannerProps = {
  id: UUID
  isCloseble: boolean
  iconComponent?: IconComponentType
  image?: {
    url: string
    url2x?: string
    url3x?: string
  }
  onClick?: VoidFunction
  onClose: (id: UUID) => void
  title?: string
  description?: string
  isLoading?: boolean
  maxDescriptionLines?: number
}

export const IncidentBanner: FC<IncidentBannerProps> = ({
  id,
  title,
  description,
  isCloseble,
  image,
  iconComponent,
  onClick,
  onClose,
  isLoading,
  maxDescriptionLines,
}) => {
  const handleClose = () => {
    onClose(id)
  }

  if (isLoading) {
    return (
      <BannerSkeleton>
        <BannerSkeleton.Avatar size={AVATAR_SIZE} />
        <BannerSkeleton.Content />
      </BannerSkeleton>
    )
  }

  return (
    <Banner use="button" onClick={onClick} data-testid={INCIDENT_BANNER_TESTID}>
      {isCloseble && (
        <Banner.CloseButton
          data-testid={CLOSE_BANNER_BUTTON_TESTID}
          aria-label="Close"
          onClick={handleClose}
        />
      )}

      <Banner.Avatar>
        <Avatar
          useIcon={iconComponent}
          variant="brand"
          image={image?.url}
          imageSet={{
            '2x': image?.url2x ?? '',
            '3x': image?.url3x ?? '',
          }}
          size={AVATAR_SIZE}
        />
      </Banner.Avatar>
      <Banner.Content>
        <Banner.Title>{title}</Banner.Title>
        <Banner.Description>
          <LineClamp tooltip="always" max={maxDescriptionLines}>
            {description}
          </LineClamp>
        </Banner.Description>
      </Banner.Content>
    </Banner>
  )
}
