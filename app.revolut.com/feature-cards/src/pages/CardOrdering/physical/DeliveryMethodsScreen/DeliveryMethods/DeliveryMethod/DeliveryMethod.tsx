import { format } from 'date-fns'
import * as locales from 'date-fns/locale'
import { FC } from 'react'
import { Radio, RadioGroupState, Item } from '@revolut/ui-kit'

import { DeliveryMethodDto } from '@revolut/rwa-core-types'
import { DateFormat, getDateFnsFormatCurrentLocale } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../../../../hooks'
import { formatDeliveryPrice, getDeliveryMethodTitleKey } from '../utils'
import { DeliveryMethodReducedPriceLabel } from './DeliveryMethodReducedPriceLabel'
import { DeliveryMethodPrice } from './styled'

type DeliveryMethodProps = {
  deliveryMethod: DeliveryMethodDto
  group: RadioGroupState<DeliveryMethodDto>
}

enum DeliveryMethodLabels {
  TitleId = 'delivery-method-title',
  DescriptionId = 'delivery-method-arrival',
}

const DEFAULT_LOCALE = locales.enGB

export const DeliveryMethod: FC<DeliveryMethodProps> = ({ deliveryMethod, group }) => {
  const t = useCardsTranslation()

  const arrivalDate = format(
    new Date(deliveryMethod.edt),
    DateFormat.EstimatedCardDeliveryTime,
    {
      locale: locales[getDateFnsFormatCurrentLocale()] || DEFAULT_LOCALE,
    },
  )

  const isFreeDelivery = !deliveryMethod.fee.amount
  const isReducedPrice = Boolean(
    deliveryMethod.originalFee?.amount &&
      deliveryMethod.fee.amount < deliveryMethod.originalFee.amount,
  )

  const titleId = `${DeliveryMethodLabels.TitleId}-${deliveryMethod.name}`
  const descriptionId = `${DeliveryMethodLabels.DescriptionId}-${deliveryMethod.name}`

  return (
    <Item use="label">
      <Item.Prefix>
        <Radio
          {...group.getInputProps({
            value: deliveryMethod,
          })}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        />
      </Item.Prefix>
      <Item.Content>
        <Item.Title id={titleId}>
          {t(getDeliveryMethodTitleKey(deliveryMethod))}
        </Item.Title>
        <Item.Description id={descriptionId}>
          {t('CardOrdering.DeliveryMethodsScreen.deliveryMethod.arrival', {
            arrivalDate,
          })}
        </Item.Description>
      </Item.Content>
      <Item.Side>
        {isReducedPrice && deliveryMethod.originalFee && (
          <Item.Value>
            <DeliveryMethodPrice isReducedPrice={isReducedPrice}>
              {formatDeliveryPrice(deliveryMethod.originalFee)}
            </DeliveryMethodPrice>
          </Item.Value>
        )}
        {!deliveryMethod.originalFee &&
          !isFreeDelivery &&
          formatDeliveryPrice(deliveryMethod.fee)}
        {((isFreeDelivery && deliveryMethod.originalFee) || isReducedPrice) && (
          <Item.Value>
            <DeliveryMethodReducedPriceLabel
              isFreeDelivery={isFreeDelivery}
              isReducedPrice={isReducedPrice}
              fee={deliveryMethod.fee}
            />
          </Item.Value>
        )}
        {isFreeDelivery && !deliveryMethod.originalFee && (
          <DeliveryMethodReducedPriceLabel
            isFreeDelivery={isFreeDelivery}
            isReducedPrice={false}
            fee={deliveryMethod.fee}
          />
        )}
      </Item.Side>
    </Item>
  )
}
