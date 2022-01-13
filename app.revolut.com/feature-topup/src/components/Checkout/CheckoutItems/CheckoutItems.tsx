import { FC } from 'react'

import { CheckoutItem, CheckoutItemProps } from '../CheckoutItem'

export type CheckoutItemsProps = {
  items: CheckoutItemProps[]
}

export const CheckoutItems: FC<CheckoutItemsProps> = ({ items }) => (
  <>
    {items.map((item) => (
      <CheckoutItem key={item.title} {...item} />
    ))}
  </>
)
