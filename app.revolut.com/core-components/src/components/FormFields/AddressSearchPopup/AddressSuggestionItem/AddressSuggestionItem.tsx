import { VFC } from 'react'

import { Item } from '@revolut/ui-kit'
import { Check } from '@revolut/icons'

import { ItemStyled } from './styled'

type AddressSuggestionItemProps = {
  address: string
  isSelected: boolean
  onClick: () => void
}

export const AddressSuggestionItem: VFC<AddressSuggestionItemProps> = ({
  address,
  isSelected,
  onClick,
}) => {
  return (
    <ItemStyled onClick={onClick}>
      <Item.Content>
        <Item.Title>{address}</Item.Title>
      </Item.Content>
      <Item.Side>{isSelected && <Check color="blue" />}</Item.Side>
    </ItemStyled>
  )
}
