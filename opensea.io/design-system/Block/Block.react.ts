import React, { CSSProperties } from "react"
import styled, { css } from "styled-components"
import {
  space,
  SpaceProps,
  size,
  SizeProps,
  layout,
  LayoutProps,
  typography,
  TypographyProps,
  flex,
  FlexProps,
  flexbox,
  FlexboxProps,
  color,
  PositionProps,
  position,
  borderRadius,
  BorderRadiusProps,
  opacity,
  OpacityProps,
  border,
  BorderProps,
} from "styled-system"

export type BlockProps = SpaceProps &
  SizeProps &
  LayoutProps &
  TypographyProps &
  FlexProps &
  FlexboxProps &
  PositionProps &
  BorderRadiusProps &
  BorderProps &
  OpacityProps & {
    as?: keyof JSX.IntrinsicElements | React.ComponentType
    children?: React.ReactNode
    cursor?: CSSProperties["cursor"]
    edge?: "start" | "end"
    style?: React.CSSProperties
  }

export const Block = styled.div<BlockProps>`
  ${space}
  ${size}
  ${layout}
  ${typography}
  ${flex}
  ${flexbox}
  ${color}
  ${position}
  ${borderRadius}
  ${opacity}
  ${border}

  cursor: ${props => props.cursor};

  ${props =>
    props.edge === "start" &&
    css`
      &:first-child {
        margin-inline-start: 0;
      }
    `}

  ${props =>
    props.edge === "end" &&
    css`
      &:last-child {
        margin-inline-end: 0;
      }
    `}
`

export default Block
