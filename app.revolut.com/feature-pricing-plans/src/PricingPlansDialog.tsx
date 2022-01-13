import { FC } from 'react'

import { BaseModalProps } from '@revolut/rwa-core-components'
import { PricingPlanDto } from '@revolut/rwa-core-types'

import { useGetFilteredPricingPlansByPriority } from './hooks'
import { PricingPlansModal, PricingPlansModalProps } from './components'

type PricingPlansProps = {
  pricingPlansFilterFn?: (pricingPlan: PricingPlanDto) => boolean
  minPriority?: number
} & BaseModalProps &
  Pick<PricingPlansModalProps, 'onPricingPlanSelected'>

export const PricingPlansDialog: FC<PricingPlansProps> = ({
  pricingPlansFilterFn,
  minPriority,
  ...plansModalProps
}) => {
  const filteredPricingPlansByPriority = useGetFilteredPricingPlansByPriority(minPriority)

  return (
    <PricingPlansModal
      pricingPlans={
        pricingPlansFilterFn
          ? filteredPricingPlansByPriority.filter(pricingPlansFilterFn)
          : filteredPricingPlansByPriority
      }
      {...plansModalProps}
    />
  )
}
