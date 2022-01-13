import noop from 'lodash/noop'
import { FC } from 'react'
import { Cash } from '@revolut/icons'
import { Media, Avatar, Item } from '@revolut/ui-kit'

import { SOWReviewState } from '../../types/generated/sow'
import { SOTReviewState } from '../../types/generated/sot'

import { getBadge } from '../../utils'

type IncomeSourceItemProps = {
  amount?: string
  frequency?: string
  onClick?: VoidFunction
  isPressed?: boolean
  reviewState?: SOWReviewState | SOTReviewState
}

export const IncomeSourceItem: FC<IncomeSourceItemProps> = ({
  onClick = noop,
  amount = '',
  frequency = '',
  isPressed,
  reviewState,
  children,
}) => {
  const { color, icon } = getBadge(reviewState?.type)

  return (
    <Item use="button" aria-pressed={isPressed} onClick={onClick}>
      <Item.Avatar>
        <Avatar useIcon={Cash} color="deep-grey">
          {icon && <Avatar.Badge bg={color} position="bottom-right" useIcon={icon} />}
        </Avatar>
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{children}</Item.Title>
        <Item.Description color={color}>{reviewState?.title}</Item.Description>
      </Item.Content>
      <Item.Side>
        <Item.Value>{amount}</Item.Value>
        <Item.Value variant="secondary">
          <Media alignItems="center">
            <Media.Content ml="s-4">{frequency}</Media.Content>
          </Media>
        </Item.Value>
      </Item.Side>
    </Item>
  )
}
