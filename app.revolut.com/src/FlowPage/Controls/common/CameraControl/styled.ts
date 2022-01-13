import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'

const centered = css`
  flex: 1;
  margin: auto;
  max-width: 640px;
  width: auto;
  height: auto;
`

export const VideoStyled = styled.video<{
  isCameraAllowed: boolean
  isSnapshotted: boolean
}>`
  ${centered}
  display: ${ifProp('isCameraAllowed', 'block', 'none')};
  display: ${ifProp('isSnapshotted', 'none')};
  max-height: 60vh;
`

export const CanvasWrapperStyled = styled.div<{ isSnapshotted: boolean }>`
  ${centered}
  display: ${ifProp('isSnapshotted', 'flex', 'none')};
`

export const CanvasStyled = styled.canvas`
  ${centered}
  max-height: 60vh;
`
