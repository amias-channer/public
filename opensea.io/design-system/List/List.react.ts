import styled from "styled-components"
import Block, { BlockProps } from "../Block"
import Item from "../Item/Item.react"

export type ListProps = BlockProps

export const List = styled(Block).attrs<ListProps>({ as: "ul" })`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  margin: 0;

  ${Item} {
    border: none;
    overflow: hidden;
  }

  > :first-child,
  > :first-child > button:first-of-type,
  > :first-child > a:first-of-type {
    border-top-left-radius: ${props => props.theme.borderRadius.default};
    border-top-right-radius: ${props => props.theme.borderRadius.default};
  }

  > :last-child,
  > :last-child > button:last-of-type,
  > :last-child > a:last-of-type {
    border-bottom-left-radius: ${props => props.theme.borderRadius.default};
    border-bottom-right-radius: ${props => props.theme.borderRadius.default};
  }

  > :not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`

export const FramedList = styled(List)`
  border: none;
`

export default List
