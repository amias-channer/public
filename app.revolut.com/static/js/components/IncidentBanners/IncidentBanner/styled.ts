import styled from 'styled-components'
import { Flex, Box } from '@revolut/ui-kit'

import { themeColor, themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.IncidentBannerIconBackground')

export const IconBackground = styled(Flex)`
  height: ${themeSize('size')};
  width: ${themeSize('size')};
  align-items: center;
  border-radius: 100%;
  justify-content: center;
  background-color: ${themeColor('incidentBannerIconBackground')};
`

export const CloseBannerWrapper = styled(Box)`
  cursor: pointer;
`
