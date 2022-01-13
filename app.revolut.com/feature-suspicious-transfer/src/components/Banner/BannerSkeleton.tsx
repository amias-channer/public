import { VFC } from 'react'
import {
  ActionWidget,
  Skeleton,
  FilterButtonSkeleton,
  AvatarSkeleton,
} from '@revolut/ui-kit'

export const BannerSkeleton: VFC = () => (
  <ActionWidget>
    <ActionWidget.Title>
      <Skeleton height={16} />
    </ActionWidget.Title>
    <ActionWidget.Content>
      <Skeleton height={14} width="150%" />
    </ActionWidget.Content>
    <ActionWidget.Actions>
      <FilterButtonSkeleton />
    </ActionWidget.Actions>
    <ActionWidget.Avatar>
      <AvatarSkeleton size={24} />
    </ActionWidget.Avatar>
  </ActionWidget>
)
