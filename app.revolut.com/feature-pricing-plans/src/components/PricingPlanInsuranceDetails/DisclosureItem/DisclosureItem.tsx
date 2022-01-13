import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

type DisclosureItemProps = {
  title: string
  onClick: VoidFunction
}

export const DisclosureItem: FC<DisclosureItemProps> = ({ title, onClick }) => (
  <Item use="button" variant="disclosure" onClick={onClick}>
    <Item.Avatar>
      <Avatar useIcon={Icons.Document} color="primary" />
    </Item.Avatar>
    <Item.Content>
      <Item.Title>{title}</Item.Title>
    </Item.Content>
  </Item>
)
