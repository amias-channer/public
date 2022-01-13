import noop from 'lodash/noop'
import { FC } from 'react'
import { Coins } from '@revolut/icons'
import { Avatar, Item } from '@revolut/ui-kit'

import { SOWReviewState } from '../../types/generated/sow'
import { SOTReviewState } from '../../types/generated/sot'

import { getBadge } from '../../utils'

type IncomeSourceItemLinkProps = {
  onClick?: VoidFunction
  isPressed?: boolean
  reviewState?: SOWReviewState | SOTReviewState
  defaultTitle?: string
}

export const IncomeSourceItemLink: FC<IncomeSourceItemLinkProps> = ({
  onClick = noop,
  isPressed,
  reviewState,
  defaultTitle,
  children,
}) => {
  const { color, icon } = getBadge(reviewState?.type)

  return (
    <Item use="button" variant="disclosure" aria-pressed={isPressed} onClick={onClick}>
      <Item.Avatar>
        <Avatar useIcon={Coins} color="deep-grey">
          {icon && <Avatar.Badge bg={color} position="bottom-right" useIcon={icon} />}
        </Avatar>
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{children}</Item.Title>
        <Item.Description color={color}>
          {reviewState?.title ?? defaultTitle}
        </Item.Description>
      </Item.Content>
    </Item>
  )
}
