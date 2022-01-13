import { Cell, Media, Skeleton } from '@revolut/ui-kit'

export const FeatureItemSkeleton = () => (
  <Cell>
    <Media>
      <Media.Side>
        <Skeleton size={24} />
      </Media.Side>
      <Media.Content alignSelf="center" ml="s-16">
        <Skeleton height={16} width={0.8} mb="s-16" />
        <Skeleton height={16} width={0.5} />
      </Media.Content>
    </Media>
  </Cell>
)
