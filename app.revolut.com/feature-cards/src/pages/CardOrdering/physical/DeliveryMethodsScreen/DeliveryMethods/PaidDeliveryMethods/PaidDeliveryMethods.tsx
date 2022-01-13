import { FC } from 'react'
import { Group, RadioGroupState, Subheader } from '@revolut/ui-kit'

import { DeliveryMethodDto } from '@revolut/rwa-core-types'

import { useCardsTranslation } from '../../../../../../hooks'
import { DeliveryMethod } from '../DeliveryMethod'

type PaidDeliveryMethodsProps = {
  deliveryMethods: DeliveryMethodDto[]
  group: RadioGroupState<DeliveryMethodDto>
}

export const PaidDeliveryMethods: FC<PaidDeliveryMethodsProps> = ({
  deliveryMethods,
  group,
}) => {
  const t = useCardsTranslation()

  return (
    <>
      <Subheader>
        <Subheader.Title>
          {t('CardOrdering.DeliveryMethodsScreen.group.paid.title')}
        </Subheader.Title>
      </Subheader>
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
