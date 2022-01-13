import { FC, useEffect } from 'react'
import { RadioGroup } from '@revolut/ui-kit'

import { DeliveryMethodDto, DeliveryMethodName } from '@revolut/rwa-core-types'

import { validateDeliveryMethod } from '../utils'
import { DeliveryMethod } from './DeliveryMethod'

type DeliveryMethodsProps = {
  standardDeliveryMethod?: DeliveryMethodDto
  priorityDeliveryMethod?: DeliveryMethodDto
  onDeliveryMethodChange: (deliveryMethod: DeliveryMethodDto) => void
}

export const DeliveryMethods: FC<DeliveryMethodsProps> = ({
  standardDeliveryMethod,
  priorityDeliveryMethod,
  onDeliveryMethodChange,
}) => {
  useEffect(() => {
    onDeliveryMethodChange(
      validateDeliveryMethod(standardDeliveryMethod || priorityDeliveryMethod),
    )
  }, [onDeliveryMethodChange, priorityDeliveryMethod, standardDeliveryMethod])

  const handleDeliveryMethodNameChange = (
    deliveryMethodName: DeliveryMethodName | null,
  ) => {
    onDeliveryMethodChange(
      validateDeliveryMethod(
        standardDeliveryMethod?.name === deliveryMethodName
          ? standardDeliveryMethod
          : priorityDeliveryMethod,
      ),
    )
  }

  return (
    <RadioGroup
      onChange={handleDeliveryMethodNameChange}
      defaultValue={
        standardDeliveryMethod ? DeliveryMethodName.Standard : DeliveryMethodName.Priority
      }
    >
      {(group) => (
        <>
          {standardDeliveryMethod && (
            <DeliveryMethod deliveryMethod={standardDeliveryMethod} group={group} />
          )}
          {priorityDeliveryMethod && (
            <DeliveryMethod deliveryMethod={priorityDeliveryMethod} group={group} />
          )}
        </>
      )}
    </RadioGroup>
  )
}
