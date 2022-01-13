import { FC } from 'react'
import { SubheaderSkeleton, Group, ItemSkeleton, Box } from '@revolut/ui-kit'

export const TransactionsGroupSkeleton: FC = () => (
  <Box mb="s-16">
    <SubheaderSkeleton />
    <Group>
      <ItemSkeleton />
      <ItemSkeleton />
      <ItemSkeleton />
    </Group>
  </Box>
)
