import { FC, ReactNode } from 'react'
import { TimeAndMoney } from '@revolut/icons'
import { Item, Avatar } from '@revolut/ui-kit'

type IncomeSourceAmountItemProps = {
  title: ReactNode
  topupLeft?: string
  declaredPercentage?: number
}

export const IncomeSourceAmountItem: FC<IncomeSourceAmountItemProps> = ({
  title,
  topupLeft = '0',
  declaredPercentage = 0,
}) => {
  return (
    <Item>
      <Item.Avatar>
        <Avatar
          useIcon={TimeAndMoney}
          color="deep-grey"
          progress={declaredPercentage / 100}
        />
      </Item.Avatar>
      <Item.Content>
        <Item.Title>{title}</Item.Title>
      </Item.Content>
      <Item.Side>{topupLeft}</Item.Side>
    </Item>
  )
}
