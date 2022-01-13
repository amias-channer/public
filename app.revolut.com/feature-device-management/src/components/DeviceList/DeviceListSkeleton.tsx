import { VFC } from 'react'

import { Group } from '@revolut/ui-kit'
import { DeviceItemSkeleton } from '../DeviceItem'

export const DeviceListSkeleton: VFC = () => (
  <Group>
    <DeviceItemSkeleton />
    <DeviceItemSkeleton />
    <DeviceItemSkeleton />
    <DeviceItemSkeleton />
    <DeviceItemSkeleton />
  </Group>
)
