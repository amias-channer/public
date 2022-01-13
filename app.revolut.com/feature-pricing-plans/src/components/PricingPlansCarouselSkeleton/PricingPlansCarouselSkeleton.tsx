import { FC } from 'react'
import { DetailsSkeleton, Tile, TileSkeleton } from '@revolut/ui-kit'

export const PRICING_PLANS_CAROUSEL_SKELETON_TEST_ID = 'pricing-plans-carousel-skeleton'

export const PricingPlansCarouselSkeleton: FC = () => (
  <TileSkeleton data-testid={PRICING_PLANS_CAROUSEL_SKELETON_TEST_ID}>
    <TileSkeleton.Title />
    <TileSkeleton.Description />
    <Tile.Footer backgroundColor="white">
      <DetailsSkeleton>
        <DetailsSkeleton.Title />
      </DetailsSkeleton>
    </Tile.Footer>
  </TileSkeleton>
)
