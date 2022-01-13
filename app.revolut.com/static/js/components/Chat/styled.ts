import styled from 'styled-components'
import { Box, mq } from '@revolut/ui-kit'

import { Z_INDICES } from '@revolut/rwa-core-styles'

const MOBILE_NAVBAR_HEIGHT_PX = 49

export const ChatWrapper = styled(Box)`
  position: fixed;

  bottom: 16px;
  right: 16px;

  z-index: ${Z_INDICES.chatButton};

  @media ${mq('*-md')} {
    bottom: ${MOBILE_NAVBAR_HEIGHT_PX + 8}px;
  }
`
