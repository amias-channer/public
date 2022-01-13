import isEmpty from 'lodash/isEmpty'
import { FC } from 'react'
import { RadioGroup } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { DeliveryMethodDto, DeliveryMethodsDto } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import { PaidDeliveryMethods } from './PaidDeliveryMethods'
import { UpgradableDeliveryMethods } from './UpgradableDeliveryMethods'

type DeliveryMethodsProps = {
  allDeliveryMethods: DeliveryMethodsDto
  selectedDeliveryMethod?: DeliveryMethodDto
  onDeliveryMethodChange: (deliveryMethod: DeliveryMethodDto) => void
}

const UPGRADABLE_METHODS_EMPTY_ARR: DeliveryMethodDto[] = []

export const DeliveryMethods: FC<DeliveryMethodsProps> = ({
  allDeliveryMethods,
  selectedDeliveryMethod,
  onDeliveryMethodChange,
}) => {
  const { deliveryMethods, upgradableDeliveryMethods = UPGRADABLE_METHODS_EMPTY_ARR } =
    allDeliveryMethods

  const handleDeliveryMethodChange = (value: DeliveryMethodDto | null) => {
    onDeliveryMethodChange(checkRequired(value, '"value" can not be null'))
  }

  const isPaidDeliveryMethodsEmpty = isEmpty(deliveryMethods)
  const isUpgradableDeliveryMethodsEmpty = isEmpty(upgradableDeliveryMethods)

  return (
    <RadioGroup value={selectedDeliveryMethod} onChange={handleDeliveryMethodChange}>
      {(group) => (
        <>
          {!isPaidDeliveryMethodsEmpty && (
            <PaidDeliveryMethods deliveryMethods={deliveryMethods} group={group} />
          )}
          {!isPaidDeliveryMethodsEmpty && !isUpgradableDeliveryMethodsEmpty && (
            <Spacer h="16px" />
          )}
          {!isUpgradableDeliveryMethodsEmpty && (
            <UpgradableDeliveryMethods
              deliveryMethods={upgradableDeliveryMethods}
              group={group}
            />
          )}
        </>
      )}
    </RadioGroup>
  )
}
