import { VFC } from 'react'

import { ItemSkeleton } from '@revolut/ui-kit'

export const DeviceItemSkeleton: VFC = () => (
  <ItemSkeleton>
    <ItemSkeleton.Avatar />
    <ItemSkeleton.Content>
      <ItemSkeleton.Title />
      <ItemSkeleton.Description />
    </ItemSkeleton.Content>
  </ItemSkeleton>
)
