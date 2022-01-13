import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { Flex } from '@revolut/ui-kit'

import { themeZIndex } from '@revolut/rwa-core-styles'

export const Container = styled(Flex)<{ isVisible: boolean }>`
  display: ${ifProp('isVisible', 'inherit', 'none')};
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: ${themeZIndex('documentViewer')};
  background: rgba(0, 0, 0, 0.2);
`

export const ViewerWrapper = styled.div`
  height: calc(100vh - 48px);
`

export const PdfView = styled.object`
  position: absolute;
  top: 48px;
  height: calc(100vh - 162px);
  width: 100%;
  z-index: ${themeZIndex('documentViewer')};
`
