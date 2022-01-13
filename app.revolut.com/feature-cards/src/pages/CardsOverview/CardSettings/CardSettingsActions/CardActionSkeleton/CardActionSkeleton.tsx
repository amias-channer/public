import { FC } from 'react'
import { ItemSkeleton } from '@revolut/ui-kit'

export const CARD_ACTION_SKELETON_TEST_ID = 'CARD_ACTION_SKELETON_TEST_ID'

export const CardActionSkeleton: FC = () => (
  <ItemSkeleton data-testid={CARD_ACTION_SKELETON_TEST_ID}>
    <ItemSkeleton.Avatar />
    <ItemSkeleton.Content>
      <ItemSkeleton.Title />
      <ItemSkeleton.Description />
    </ItemSkeleton.Content>
  </ItemSkeleton>
)
