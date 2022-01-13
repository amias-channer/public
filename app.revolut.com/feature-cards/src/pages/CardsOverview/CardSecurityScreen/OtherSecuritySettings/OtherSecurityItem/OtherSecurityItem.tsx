import { FC } from 'react'
import { UiKitIconComponentType } from '@revolut/icons'
import { Avatar, Item, Switch } from '@revolut/ui-kit'

type OtherSecurityItemProps = {
  Icon: UiKitIconComponentType
  title: string
  description: string
  defaultChecked: boolean
  onChange: (checked: boolean) => void
}

export const OtherSecurityItem: FC<OtherSecurityItemProps> = ({
  Icon,
  title,
  description,
  defaultChecked,
  onChange,
}) => (
  <Item use="label">
    <Item.Avatar>
      <Avatar useIcon={Icon} />
    </Item.Avatar>
    <Item.Content>
      <Item.Title>{title}</Item.Title>
      <Item.Description>{description}</Item.Description>
    </Item.Content>
    <Item.Side>
      <Switch
        defaultChecked={defaultChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </Item.Side>
  </Item>
)
