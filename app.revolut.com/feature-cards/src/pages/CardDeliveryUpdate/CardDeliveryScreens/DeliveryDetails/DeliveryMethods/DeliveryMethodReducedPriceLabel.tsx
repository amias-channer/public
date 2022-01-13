import { FC } from 'react'

import { Spacer } from '@revolut/rwa-core-components'
import { MoneyDto } from '@revolut/rwa-core-types'

import { useCardsTranslation } from '../../../../../hooks'
import { DeliveryMethodPrice, DeliveryMethodPriceFreeLabel } from './styled'
import { formatDeliveryPrice } from './utils'

type DeliveryMethodReducedPriceLabelProps = {
  isFreeDelivery: boolean
  isReducedPrice: boolean
  originalFee?: MoneyDto
  fee: MoneyDto
}

export const DeliveryMethodReducedPriceLabel: FC<DeliveryMethodReducedPriceLabelProps> =
  ({ isFreeDelivery, isReducedPrice, originalFee, fee }) => {
    const t = useCardsTranslation()

    if (isFreeDelivery && originalFee) {
      return (
        <>
          <Spacer h="px4" />
          <DeliveryMethodPriceFreeLabel>
            {t('CardOrdering.DeliveryDetailsScreen.deliveryMethod.free')}
          </DeliveryMethodPriceFreeLabel>
        </>
      )
    }

    if (!isFreeDelivery && isReducedPrice) {
      return (
        <>
          <Spacer h="px4" />
          <DeliveryMethodPrice>{formatDeliveryPrice(fee)}</DeliveryMethodPrice>
        </>
      )
    }

    return null
  }
