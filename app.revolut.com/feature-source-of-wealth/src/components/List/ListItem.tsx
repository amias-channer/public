import { FC } from 'react'
import { IconComponentType } from '@revolut/icons'
import { Item } from '@revolut/ui-kit'

type ListItemProps = {
  icon: IconComponentType
}

export const ListItem: FC<ListItemProps> = ({ children, icon }) => {
  return (
    <Item useIcon={icon} iconColor="grey-tone-50">
      <Item.Content>
        <Item.Title color="grey-tone-50">{children}</Item.Title>
      </Item.Content>
    </Item>
  )
}
