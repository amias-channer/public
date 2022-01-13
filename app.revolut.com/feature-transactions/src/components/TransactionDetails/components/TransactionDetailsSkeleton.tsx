import { Box, DetailsCellSkeleton, Group, HeaderSkeleton } from '@revolut/ui-kit'

export const LOADING_TEST_ID = 'txn_loading_testid'

export const TransactionDetailsSkeleton = () => {
  return (
    <Box data-testid={LOADING_TEST_ID}>
      <HeaderSkeleton variant="item" />

      <Group>
        <DetailsCellSkeleton>
          <DetailsCellSkeleton.Title />
          <DetailsCellSkeleton.Content />
          <DetailsCellSkeleton.Note />
        </DetailsCellSkeleton>

        <DetailsCellSkeleton>
          <DetailsCellSkeleton.Title />
          <DetailsCellSkeleton.Content />
          <DetailsCellSkeleton.Note />
        </DetailsCellSkeleton>

        <DetailsCellSkeleton>
          <DetailsCellSkeleton.Title />
          <DetailsCellSkeleton.Content />
          <DetailsCellSkeleton.Note />
        </DetailsCellSkeleton>
      </Group>
    </Box>
  )
}
