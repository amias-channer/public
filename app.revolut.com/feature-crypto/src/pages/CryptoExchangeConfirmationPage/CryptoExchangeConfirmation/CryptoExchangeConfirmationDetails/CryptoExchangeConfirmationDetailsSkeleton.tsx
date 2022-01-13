import { VFC } from 'react'
import { Group, DetailsCellSkeleton } from '@revolut/ui-kit'

export const CryptoExchangeConfirmationDetailsSkeleton: VFC = () => (
  <Group>
    <DetailsCellSkeleton />
    <DetailsCellSkeleton />
    <DetailsCellSkeleton />
    <DetailsCellSkeleton />
    <DetailsCellSkeleton />
  </Group>
)
