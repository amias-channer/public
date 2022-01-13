import { VFC } from 'react'
import { times } from 'lodash'
import { ContactSkeleton } from '@revolut/ui-kit'

const DEFAULT_AMOUNT = 20

type GridSkeletonProps = {
  itemsAmount?: number
}

export const GridSkeleton: VFC<GridSkeletonProps> = ({
  itemsAmount = DEFAULT_AMOUNT,
}) => (
  <>
    {times(itemsAmount).map((key) => (
      <ContactSkeleton key={key} />
    ))}
  </>
)
