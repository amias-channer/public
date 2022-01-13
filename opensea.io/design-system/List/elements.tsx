import React, { forwardRef } from "react"
import styled from "styled-components"
import Item, { ItemProps } from "../Item"
import { isInteractiveElement } from "../utils/element"

const StyledListItem = styled.li`
  width: 100%;
`

export const ListItemBase = forwardRef<HTMLLIElement, ItemProps>(
  function ListItem(props, ref) {
    if (isInteractiveElement(props)) {
      return (
        <StyledListItem ref={ref}>
          <Item {...props} />
        </StyledListItem>
      )
    }

    return <Item as="li" {...props} ref={ref} />
  },
)

export const ListItem = Object.assign(ListItemBase, {
  Avatar: Item.Avatar,
  Content: Item.Content,
  Title: Item.Title,
  Action: Item.Action,
  Side: Item.Side,
  Description: Item.Description,
})
