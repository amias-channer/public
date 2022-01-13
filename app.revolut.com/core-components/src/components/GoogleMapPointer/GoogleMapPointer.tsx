import qs from 'qs'
import { FC, IframeHTMLAttributes } from 'react'
import { Box, CardProps } from '@revolut/ui-kit'

import { ConfigKey, getConfigValue } from '@revolut/rwa-core-config'

import { StyledIframe, StyledCard } from './styled'

type Center = {
  latitude: number
  longitude: number
}

type Props = {
  address: string
  iframeProps?: IframeHTMLAttributes<HTMLIFrameElement>
  center?: Center
} & CardProps

export const GOOGLE_MAP_TEST_ID = 'google-map-iframe-testid'

const getMapIFrameSourceByAddress = (
  apiKey: string,
  address: string,
  center?: Center,
) => {
  const args = qs.stringify(
    {
      key: apiKey,
      q: encodeURIComponent(address),
      center: center && [center.latitude, center.longitude].join(','),
    },
    { encode: false },
  )

  return `https://www.google.com/maps/embed/v1/place?${args}`
}

export const GoogleMapPointer: FC<Props> = ({
  address,
  center,
  iframeProps,
  ...rest
}) => {
  const apiKey = getConfigValue(ConfigKey.GoogleMapsAPIKey)
  const src = getMapIFrameSourceByAddress(apiKey, address, center)

  return (
    <StyledCard {...rest} variant="plain" overflow="hidden">
      <StyledIframe
        src={src}
        title={address}
        data-testid={GOOGLE_MAP_TEST_ID}
        {...iframeProps}
      />
      <Box p="s-24">{address}</Box>
    </StyledCard>
  )
}
