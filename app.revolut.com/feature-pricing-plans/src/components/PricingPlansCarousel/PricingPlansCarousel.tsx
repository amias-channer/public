import { FC } from 'react'
import { Carousel } from '@revolut/ui-kit'

import { PricingPlanCode } from '@revolut/rwa-core-types'

import { PricingPlanTile } from './PricingPlanTile'

type PlansCarouselProps = {
  plans: PricingPlanCode[]
  currentSlideIndex: number
  onSlideChange: (slideIndex: number) => void
}

export const PricingPlansCarousel: FC<PlansCarouselProps> = ({
  plans,
  currentSlideIndex,
  onSlideChange,
}) => (
  <Carousel index={currentSlideIndex} onIndexChange={onSlideChange}>
    {plans.map((planCode) => (
      <Carousel.Item key={planCode} width={1}>
        <PricingPlanTile key={planCode} pricingPlanCode={planCode} />
      </Carousel.Item>
    ))}
  </Carousel>
)
