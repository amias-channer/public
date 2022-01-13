import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'
import { Box, Flex } from '@revolut/ui-kit'

import { themeNamespace } from '@revolut/rwa-core-styles'

const { themeSize } = themeNamespace('components.TopUp.TopUpViaCardScreen')

const IFRAME_WIDTH = '100%'

export const IFrame3dsContainer = styled(Box)<{ isShown: boolean }>`
  overflow: hidden;
  position: relative;

  ${ifProp(
    'isShown',
    css`
      width: ${IFRAME_WIDTH};
      height: ${themeSize('iFrame.height')};
    `,
    css`
      width: 0;
      height: 0;
    `,
  )}
`

export const IFrame3dsSpinnerContainer = styled(Flex)`
  position: absolute;

  align-items: center;
  justify-content: center;

  width: ${IFRAME_WIDTH};
  height: ${themeSize('iFrame.height')};
`

export const IFrame3ds = styled.iframe.attrs({
  frameBorder: 0,
})`
  background: transparent;

  position: absolute;

  width: ${IFRAME_WIDTH};
  height: ${themeSize('iFrame.height')};
`
