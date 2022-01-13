import { FC } from 'react'
import { ItemSkeleton } from '@revolut/ui-kit'

export const DeliveryMethodsScreenSkeleton: FC = () => {
  return (
    <ItemSkeleton>
      <ItemSkeleton.Content />
      <ItemSkeleton.Side />
    </ItemSkeleton>
  )
}
