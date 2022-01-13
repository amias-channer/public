import { FC, Fragment } from 'react'
import { ItemSkeleton } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { PricingPlanCode } from '@revolut/rwa-core-types'

import { useGetPricingPlanByCode } from '../../hooks'
import { FeatureGroup } from './FeatureGroup'

export type FeatureListProps = {
  selectedPricingPlanCode: PricingPlanCode
}

export const FeatureList: FC<FeatureListProps> = ({ selectedPricingPlanCode }) => {
  const { pricingPlan, isPricingPlansFetching } = useGetPricingPlanByCode(
    selectedPricingPlanCode,
  )

  if (!pricingPlan || isPricingPlansFetching) {
    return (
      <ItemSkeleton>
        <ItemSkeleton.Content>
          <ItemSkeleton.Title />
        </ItemSkeleton.Content>
      </ItemSkeleton>
    )
  }

  return (
    <>
      {pricingPlan.featureGroups.map((featureGroup, index) => (
        <Fragment key={featureGroup.name}>
          <FeatureGroup featureGroup={featureGroup} pricingPlan={pricingPlan} />
          {index < pricingPlan.featureGroups.length - 1 && <Spacer h="8px" />}
        </Fragment>
      ))}
    </>
  )
}
