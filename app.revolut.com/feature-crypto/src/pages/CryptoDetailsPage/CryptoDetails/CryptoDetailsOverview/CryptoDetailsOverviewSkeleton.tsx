import { FC } from 'react'
import { Box, Group, DetailsCellSkeleton } from '@revolut/ui-kit'

export const CryptoDetailsOverviewSkeleton: FC = () => {
  return (
    <>
      <Box mb="s-32">
        <Group>
          <DetailsCellSkeleton />
          <DetailsCellSkeleton />
          <DetailsCellSkeleton />
        </Group>
      </Box>
      <Box mb="s-32">
        <Group>
          <DetailsCellSkeleton />
          <DetailsCellSkeleton />
          <DetailsCellSkeleton />
        </Group>
      </Box>
    </>
  )
}
