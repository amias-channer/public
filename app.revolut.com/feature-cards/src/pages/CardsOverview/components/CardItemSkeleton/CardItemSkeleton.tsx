import { FC } from 'react'
import { ItemSkeleton } from '@revolut/ui-kit'

export const CardItemSkeleton: FC = () => (
  <ItemSkeleton>
    <ItemSkeleton.Avatar />
    <ItemSkeleton.Content>
      <ItemSkeleton.Title />
      <ItemSkeleton.Description />
    </ItemSkeleton.Content>
  </ItemSkeleton>
)
