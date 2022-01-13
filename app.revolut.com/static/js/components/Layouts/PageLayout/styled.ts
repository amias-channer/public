import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'
import { Box, Flex, mq } from '@revolut/ui-kit'

import { themeColor, themeSpace, themeNamespace } from '@revolut/rwa-core-styles'

import { PageLayoutVariant } from './constants'

const { themeSize } = themeNamespace('components.PageLayout')
export const PageLayoutBase = styled(Box)`
  background-color: ${themeColor('layoutBackground')};
  min-height: 100vh;
  position: relative;
  ${ifProp(
    { variant: PageLayoutVariant.WithSidebar },
    css`
      padding-top: ${themeSpace('px52')};
      padding-left: ${themeSpace('px16')};
      padding-right: ${themeSpace('px16')};
      padding-bottom: ${themeSpace('px24')};
    `,
    css`
      padding-top: ${themeSpace('px24')};
      padding-left: ${themeSpace('px16')};
      padding-right: ${themeSpace('px16')};
      padding-bottom: ${themeSpace('px32')};
    `,
  )}
  @media ${mq('lg')} {
    ${ifProp(
      { variant: PageLayoutVariant.WithSidebar },
      css`
        padding-top: ${themeSpace('px24')};
        padding-bottom: ${themeSpace('px24')};
        padding-left: 0;
        padding-right: 0;
      `,
      css`
        padding-top: ${themeSpace('px32')};
        padding-left: ${themeSpace('px32')};
        padding-right: ${themeSpace('px32')};
        padding-bottom: ${themeSpace('px48')};
      `,
    )}
  }
`
export const PageLayoutContent = styled(Flex)`
  flex-direction: column;
  position: relative;

  @media ${mq('*-md')} {
    margin-top: 16px;
  }

  ${ifProp(
    { variant: PageLayoutVariant.WithSidebar },
    css`
      min-height: calc(100vh - 64px);
    `,
  )}

  @media ${mq('md')} {
    ${ifProp(
      { variant: PageLayoutVariant.Details },
      css`
        max-width: ${themeSize('maxWidth')};
        margin: 0 auto;
      `,
    )}
  }
  @media ${mq('lg')} {
    ${ifProp(
      { variant: PageLayoutVariant.WithSidebar },
      css`
        width: 100%;
        max-width: ${themeSize('maxWidth')};
        padding-left: ${themeSpace('px16')};
        padding-right: ${themeSpace('px16')};
        margin: 0 auto;
      `,
    )}
  }
`
