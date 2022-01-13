import styled from 'styled-components'
import { Flex } from '@revolut/ui-kit'

import { themeColor, themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.MobileAppBanner')

export const ContainerStyled = styled(Flex)`
  border-top: 1px solid ${themeColor('mobileBannerBorder')};
  border-bottom: 1px solid ${themeColor('mobileBannerBorder')};

  align-items: center;

  min-height: ${themeSize('height')};
`
