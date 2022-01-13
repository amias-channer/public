import type { CSSProperties } from "react"
import { darken, rgba } from "polished"
import styled from "styled-components"
import { Z_INDEX } from "../../constants/zIndex"
import { themeVariant } from "../../styles/styleUtils"
import type { BlockProps } from "../Block"

export type OverlayProps = BlockProps & {
  active: boolean
  backgroundColor?: CSSProperties["backgroundColor"]
  transitionDuration?: number
}

export const Overlay = styled.div.attrs<OverlayProps>(props => ({
  "aria-hidden": !props.active,
}))<OverlayProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: ${props => props.zIndex ?? Z_INDEX.OVERLAY};
  opacity: ${props => (props.active ? 1 : 0)};
  height: ${props => (props.active ? undefined : 0)};
  transition: ${({ transitionDuration }) =>
    transitionDuration
      ? `opacity ${transitionDuration}s ease-in-out`
      : undefined};

  ${props =>
    themeVariant({
      variants: {
        dark: {
          backgroundColor:
            props.backgroundColor ??
            darken(1, rgba(props.theme.colors.background, 0.5)),
        },
        light: {
          backgroundColor:
            props.backgroundColor ??
            darken(1, rgba(props.theme.colors.background, 0.15)),
        },
      },
    })}
`

export default Overlay
