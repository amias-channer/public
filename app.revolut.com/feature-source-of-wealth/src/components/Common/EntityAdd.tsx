import { FC } from 'react'
import { Plus } from '@revolut/icons'
import { Item, Avatar, ItemTitleProps } from '@revolut/ui-kit'

type EntityAddProps = {
  onClick?: VoidFunction
} & ItemTitleProps

export const EntityAdd: FC<EntityAddProps> = ({
  children,
  onClick,
  ...itemTitleProps
}) => {
  return (
    <Item use="button" type="button" onClick={onClick}>
      <Item.Avatar>
        <Avatar useIcon={Plus} />
      </Item.Avatar>
      <Item.Content>
        <Item.Title {...itemTitleProps}>{children}</Item.Title>
      </Item.Content>
    </Item>
  )
}
