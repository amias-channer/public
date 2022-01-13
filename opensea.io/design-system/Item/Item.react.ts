import React, { MouseEventHandler, FocusEventHandler } from "react"
import styled, { css } from "styled-components"
import { LinkProps } from "../../components/common/Link.react"
import VerticalAligned from "../../components/common/VerticalAligned.react"
import { Block } from "../Block"
import Flex, { FlexProps } from "../Flex"
import Text from "../Text"
import { getInteractiveElement, isInteractiveElement } from "../utils/element"
import { ItemAvatar } from "./ItemAvatar.react"

type ItemPropsBase = FlexProps & {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  onMouseMove?: MouseEventHandler<HTMLElement>
  onMouseDown?: MouseEventHandler<HTMLElement>
  onBlur?: FocusEventHandler<HTMLElement>
  style?: React.CSSProperties
  className?: string
}

type LinkItemProps = ItemPropsBase & { href: string } & Omit<
    LinkProps,
    keyof ItemPropsBase
  >
type DefaultItemProps = ItemPropsBase & { href?: undefined }

export type ItemProps = DefaultItemProps | LinkItemProps

export const itemHoverStyles = css`
  :hover {
    transition: 0.2s;
    box-shadow: ${props => props.theme.shadow};
    background-color: ${props => props.theme.colors.surface};
    opacity: 1;
  }
`

export const ItemBase = styled(Flex).attrs<ItemProps>(props => ({
  as: getInteractiveElement(props),
}))<ItemProps>`
  width: 100%;
  font-weight: 600;
  padding: 16px;
  border: ${props => props.border ?? `1px solid ${props.theme.colors.border}`};
  opacity: ${props => (isInteractiveElement(props) ? 0.85 : 1)};
  color: ${props => props.theme.colors.text.body};

  :hover {
    color: ${props => props.theme.colors.text.body} !important;
  }

  ${props =>
    isInteractiveElement(props) &&
    !props.disabled &&
    css`
      ${itemHoverStyles}
    `}

  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
    `}
`

const ItemContent = styled(VerticalAligned)({
  alignSelf: "stretch",
  flex: "1 1 auto",
  flexFlow: "column",
  justifyContent: "center",
  marginRight: "16px",
  order: 3,
  overflow: "hidden",
  fontSize: "16px",
  alignItems: "flex-start",
})

const ItemTitle = styled(Text).attrs({ as: "span", variant: "bold" })``
ItemTitle.defaultProps = {
  fontSize: "14px",
}

const ItemSide = styled(Block)({
  alignSelf: "stretch",
  display: "flex",
  flex: "0 0 auto",
  flexFlow: "column",
  justifyContent: "center",
  maxWidth: "40%",
  order: 4,
  overflow: "hidden",
  textAlign: "right",
})

const ItemAction = styled(Block)({
  order: 5,
  marginLeft: "12px",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
})

const ItemDescription = styled(Text).attrs({ variant: "info", as: "span" })``

export const Item = Object.assign(ItemBase, {
  Avatar: ItemAvatar,
  Content: ItemContent,
  Title: ItemTitle,
  Side: ItemSide,
  Description: ItemDescription,
  Action: ItemAction,
})

export default Item
