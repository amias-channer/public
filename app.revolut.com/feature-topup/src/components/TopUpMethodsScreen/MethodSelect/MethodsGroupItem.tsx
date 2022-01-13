import { ReactElement, FC, MouseEvent } from 'react'
import * as Icons from '@revolut/icons'
import { IconButton, Item } from '@revolut/ui-kit'

export const TEST_ID_METHODS_GROUP_ITEM_INFO_ICON = 'methods-group-item-info-icon'

type DepositMethodGroupItemProps = {
  Icon: ReactElement
  title: string
  description?: string
  onClick: VoidFunction
  onInfoClick?: VoidFunction
}

export const MethodsGroupItem: FC<DepositMethodGroupItemProps> = ({
  Icon,
  title,
  description,
  onClick,
  onInfoClick,
}) => {
  const handleCardInfoClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onInfoClick?.()
  }

  return (
    <Item use="button" onClick={onClick}>
      <Item.Avatar>{Icon}</Item.Avatar>
      <Item.Content>
        <Item.Title>{title}</Item.Title>
        {description && <Item.Description>{description}</Item.Description>}
      </Item.Content>

      {onInfoClick && (
        <Item.Side>
          <IconButton
            data-testid={TEST_ID_METHODS_GROUP_ITEM_INFO_ICON}
            use="a"
            color="primary"
            useIcon={Icons.InfoOutline}
            onClick={handleCardInfoClick}
          />
        </Item.Side>
      )}
    </Item>
  )
}
