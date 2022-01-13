import { format } from 'date-fns'
import * as locales from 'date-fns/locale'
import { FC } from 'react'
import { Media, Radio, RadioGroupState, TextBox } from '@revolut/ui-kit'

import { Spacer } from '@revolut/rwa-core-components'
import { DeliveryMethodDto, DeliveryMethodName } from '@revolut/rwa-core-types'
import { DateFormat, getDateFnsFormatCurrentLocale } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../../../hooks'
import { DeliveryMethodReducedPriceLabel } from './DeliveryMethodReducedPriceLabel'
import { CardStyled, DeliveryMethodPrice } from './styled'
import { formatDeliveryPrice, getDeliveryMethodTitleKey } from './utils'

type DeliveryMethodsProps = {
  deliveryMethod: DeliveryMethodDto
  group: RadioGroupState<DeliveryMethodName>
}

export const DeliveryMethod: FC<DeliveryMethodsProps> = ({ deliveryMethod, group }) => {
  const t = useCardsTranslation()

  const arrivalDate = format(
    new Date(deliveryMethod.edt),
    DateFormat.EstimatedCardDeliveryTime,
    {
      locale: locales[getDateFnsFormatCurrentLocale()] || locales.enGB,
    },
  )

  const radioProps = group.getInputProps({ value: deliveryMethod.name })

  const isFreeDelivery = !deliveryMethod.fee.amount
  const isReducedPrice =
    Boolean(
      deliveryMethod.originalFee?.amount &&
        deliveryMethod.fee.amount < deliveryMethod.originalFee.amount,
    ) || isFreeDelivery

  return (
    <CardStyled
      key={deliveryMethod.name}
      checked={radioProps.checked}
      mb="px16"
      variant="ghost"
    >
      <Radio
        wrapper={{
          alignItems: 'flex-start',
          px: { _: 'px24', md: 'px32' },
          py: { _: 'px16', md: 'px24' },
        }}
        {...radioProps}
      >
        <Media>
          <Media.Content alignSelf="center">
            <TextBox fontWeight="bolder">
              {t(getDeliveryMethodTitleKey(deliveryMethod))}
            </TextBox>
            <Spacer h="px4" />
            <TextBox fontSize="smaller" color="cardOrderingArrivalDate">
              {t('CardOrdering.DeliveryDetailsScreen.deliveryMethod.arrival', {
                arrivalDate,
              })}
            </TextBox>
          </Media.Content>
          <Media.Side>
            <DeliveryMethodPrice isReducedPrice={isReducedPrice}>
              {isReducedPrice && deliveryMethod.originalFee
                ? formatDeliveryPrice(deliveryMethod.originalFee)
                : formatDeliveryPrice(deliveryMethod.fee)}
            </DeliveryMethodPrice>
            <DeliveryMethodReducedPriceLabel
              isFreeDelivery={isFreeDelivery}
              isReducedPrice={isReducedPrice}
              originalFee={deliveryMethod.originalFee}
              fee={deliveryMethod.fee}
            />
          </Media.Side>
        </Media>
      </Radio>
    </CardStyled>
  )
}
