import React from 'react'
import { Avatar, Item } from '@revolut/ui-kit'
import * as Icons from '@revolut/icons'

type Props = {
  text: string
  icon: string
  onClick: () => void
}
export const MEDIA_ICON_TESTID = 'action-button-media-icon-testid'

export const ActionCard: React.FC<Props> = ({ text, onClick, icon }) => {
  const Icon = Icons[icon]
  return (
    <Item use="button" onClick={onClick}>
      <Item.Avatar data-testid={MEDIA_ICON_TESTID}>
        <Avatar useIcon={Icon} />
      </Item.Avatar>
      <Item.Content>
        <Item.Title color="primary">{text}</Item.Title>
      </Item.Content>
    </Item>
  )
}

export default ActionCard
