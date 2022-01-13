import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Item } from '@revolut/ui-kit'

type Props = {
  description: string
  stepNumber: number
}

export const Action: FC<Props> = ({ description, stepNumber }) => {
  return (
    <Item useIcon={Icons[`Bullet${stepNumber}`]} iconColor="black">
      <Item.Content>
        <Item.Title>{description}</Item.Title>
      </Item.Content>
    </Item>
  )
}
