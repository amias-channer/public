import * as React from 'react'
import styled, { css } from 'styled-components'
import { Box } from '@revolut/ui-kit'

const ZoomIn = css`
  cursor: zoom-in;
  max-width: 80vw;
  max-height: 80vh;
`

const ZoomOut = css`
  cursor: zoom-out;
  max-width: 50vw;
  max-height: 50vh;
  transform: scale(2);
`

export const ImageBase = styled<React.ElementType>(Box).attrs({
  as: 'img',
  m: 'auto',
})`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  ${({ zoom }) => (zoom ? ZoomOut : ZoomIn)};
`

export const PreviewButtonWrapper = styled<React.ElementType>(Box)`
  position: absolute;
  right: 0;
  top: 0;
`
PreviewButtonWrapper.displayName = 'PreviewButtonWrapper'
