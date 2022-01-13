import { FC, ReactNode } from 'react'
import { Document } from '@revolut/icons'
import { Item, Avatar } from '@revolut/ui-kit'

import { SOWReviewState } from '../../types/generated/sow'
import { SOTReviewState } from '../../types/generated/sot'

import { getBadge } from '../../utils'

type DocumentGroupItemProps = {
  reviewState?: SOWReviewState | SOTReviewState
  onClick?: VoidFunction
  isPressed?: boolean
  description?: ReactNode
}

export const DocumentGroupItem: FC<DocumentGroupItemProps> = ({
  onClick,
  isPressed,
  reviewState,
  description,
  children,
}) => {
  const { color, icon } = getBadge(reviewState?.type)

  return (
    <Item use="button" aria-pressed={isPressed} onClick={onClick}>
      <Item.Avatar>
        <Avatar useIcon={Document} color="deep-grey">
          {icon && <Avatar.Badge bg={color} position="bottom-right" useIcon={icon} />}
        </Avatar>
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{children}</Item.Title>
        <Item.Description color={color}>
          {description ?? reviewState?.title}
        </Item.Description>
      </Item.Content>
    </Item>
  )
}
