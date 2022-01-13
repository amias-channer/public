import styled from 'styled-components'
import { Flex, Button, Box, mq } from '@revolut/ui-kit'

import { themeFontSize, themeSpace } from '@revolut/rwa-core-styles'

const CONTAINER_SPACE_DESKTOP = themeSpace('px32')
const CONTAINER_SPACE_TABLET = themeSpace('px16')
const INNER_CONTAINER_SPACE = themeSpace('authLayoutInnerSpace')

export const CookieBannerOuter = styled(Flex).attrs({
  minHeight: 'components.CookiesBanner.Outer.minHeight',
  color: 'cookiesBannerText',
  alignItems: 'center',
  backgroundColor: 'cookiesBannerBackground',
})``

export const CookieBannerInner = styled(Flex).attrs({
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: 'components.CookiesBanner.Inner.maxWidth',
  width: '100%',
})`
  margin-left: calc(${CONTAINER_SPACE_DESKTOP} + ${INNER_CONTAINER_SPACE});
  margin-right: ${CONTAINER_SPACE_DESKTOP};

  @media ${mq('*-md')} {
    margin-left: ${CONTAINER_SPACE_TABLET};
    margin-right: ${CONTAINER_SPACE_TABLET};
    padding-top: ${themeSpace('px16')};
    flex-wrap: wrap;
  }
`

export const PolicyTextWrapper = styled(Box)`
  font-size: ${themeFontSize('cookiesBanner')};
  flex-wrap: nowrap;
  flex: 1;
  @media ${mq('*-md')} {
    width: 100%;
    margin-bottom: ${themeSpace('px16')};
    margin-right: ${themeSpace('px4')};
  }
`

export const ButtonsWrapper = styled(Flex)`
  flex-wrap: nowrap;
  @media ${mq('*-md')} {
    justify-content: flex-end;
    margin-bottom: ${themeSpace('px16')};
  }
`

export const AcceptPolicyButton = styled(Button).attrs({
  variant: 'outline',
  size: 'sm',
})`
  font-size: ${themeFontSize('cookiesBanner')};
  height: ${themeSpace('px40')};
  padding: 0 ${themeSpace('px24')};
`
