import { FC } from 'react'
import { Group, RadioGroupState, Subheader, SubheaderSkeleton } from '@revolut/ui-kit'

import { DeliveryMethodDto, PricingPlanFeature } from '@revolut/rwa-core-types'
import { formatMoneyWhenWholeNumber } from '@revolut/rwa-core-utils'
import {
  getMonthlyBilling,
  useGetLowPriorityPlanWithFeature,
} from '@revolut/rwa-feature-pricing-plans'

import { useCardsTranslation } from '../../../../../../hooks'
import { DeliveryMethod } from '../DeliveryMethod'

type UpgradableDeliveryMethodsProps = {
  deliveryMethods: DeliveryMethodDto[]
  group: RadioGroupState<DeliveryMethodDto>
}

export const UpgradableDeliveryMethods: FC<UpgradableDeliveryMethodsProps> = ({
  deliveryMethods,
  group,
}) => {
  const t = useCardsTranslation()

  const lowPriorityPricingPlan = useGetLowPriorityPlanWithFeature(
    PricingPlanFeature.FreeExpressDelivery,
  )

  const upgradableMinBillingFee = lowPriorityPricingPlan
    ? getMonthlyBilling(lowPriorityPricingPlan)?.fee
    : null

  return (
    <>
      {lowPriorityPricingPlan && upgradableMinBillingFee ? (
        <Subheader>
          <Subheader.Title>
            {t('CardOrdering.DeliveryMethodsScreen.group.upgradable.title', {
              price: formatMoneyWhenWholeNumber(
                upgradableMinBillingFee,
                lowPriorityPricingPlan.currency,
              ),
            })}
          </Subheader.Title>
        </Subheader>
      ) : (
        <SubheaderSkeleton>
          <SubheaderSkeleton.Title />
        </SubheaderSkeleton>
      )}
      <Group>
        {deliveryMethods.map((deliveryMethod) => (
          <DeliveryMethod
            key={deliveryMethod.name}
            deliveryMethod={deliveryMethod}
            group={group}
          />
        ))}
      </Group>
    </>
  )
}
