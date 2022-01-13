import React, { forwardRef } from "react"
import styled, { css } from "styled-components"
import { themeVariant } from "../../styles/styleUtils"
import { AvatarBase } from "../Avatar"
import Block, { BlockProps } from "../Block"
import Flex, { FlexProps } from "../Flex"
import Item from "../Item"
import Text from "../Text"
import { getInteractiveElement, isInteractiveElement } from "../utils/element"

export type MenuProps = BlockProps & {
  direction?: "horizontal" | "vertical"
}

const MenuBase = styled(Block).attrs({ as: "ul" })<MenuProps>`
  margin: 0;
  &&& {
    padding: 8px;
  }

  ${props =>
    props.direction === "horizontal"
      ? css`
          display: flex;
          overflow: auto;

          ${MenuTitle} {
            flex: 0;
          }
        `
      : css`
          ${StyledMenuItem}, ${StyledListMenuItem} {
            width: 100%;
          }
        `}
`

type BaseMenuItemProps = FlexProps & { $active?: boolean }

type LinkMenuItemProps = BaseMenuItemProps & { href: string }

type ClickableMenuItemProps = BaseMenuItemProps & {
  onClick?: () => unknown
  href?: undefined
}

type MenuItemProps =
  | BaseMenuItemProps
  | LinkMenuItemProps
  | ClickableMenuItemProps

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(function MenuItem(
  props,
  ref,
) {
  if (isInteractiveElement(props)) {
    return (
      <StyledListMenuItem ref={ref}>
        <StyledMenuItem {...props} />
      </StyledListMenuItem>
    )
  }

  return <StyledMenuItem as="li" {...props} ref={ref} />
})

const StyledListMenuItem = styled.li``

const MenuTitle = styled(Text).attrs({ variant: "bold", as: "span" })({
  flex: 1,
  textAlign: "left",
  marginRight: "16px",
  order: 3,
  color: "inherit",
})

const MenuAvatar = styled(AvatarBase)`
  align-self: center;
  order: 2;
  margin-right: 16px;
`

const MenuExtra = styled(Text).attrs({
  as: "span",
  color: "inherit",
  variant: "small",
})``

const MenuSide = styled(Item.Side)``

const StyledMenuItem = styled(Flex).attrs<MenuItemProps>(props => ({
  as: getInteractiveElement(props),
}))<MenuItemProps>`
  width: 100%;
  border-radius: ${props => props.theme.borderRadius.default};
  transition: color 1s ease, background-color 1s ease;
  padding: 12px;
  color: ${props =>
    props.$active
      ? props.theme.colors.text.body
      : props.theme.colors.text.subtle};

  ${props =>
    themeVariant({
      variants: {
        light: {
          backgroundColor: props.$active
            ? props.theme.colors.lightMarina
            : props.theme.colors.background,
        },
        dark: {
          backgroundColor: props.$active
            ? props.theme.colors.darkSeaBlue
            : props.theme.colors.background,
        },
      },
    })}

  :hover {
    ${props =>
      themeVariant({
        variants: {
          dark: { color: props.theme.colors.white },
          light: { color: props.theme.colors.oil },
        },
      })}
  }
`

export const Menu = Object.assign(MenuBase, {
  Item: MenuItem,
  Title: MenuTitle,
  Avatar: MenuAvatar,
  Side: MenuSide,
  Extra: MenuExtra,
})
