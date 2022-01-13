import styled from 'styled-components'
import { Box, mq } from '@revolut/ui-kit'

import { themeNamespace, themeSpace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('pages.RequestScopedToken.SelfieHeading')

export const SelfieHeading = styled(Box)`
  position: absolute;
  top: ${themeSpace('px24')};

  @media ${mq('md')} {
    left: 50%;
    transform: translateX(-50%);

    width: ${themeSize('width')};
  }

  @media ${mq('*-md')} {
    left: 0;
    padding-left: ${themeSpace('px16')};
    padding-right: ${themeSpace('px16')};
  }
`
