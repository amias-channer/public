import { FC } from 'react'

import { MoneyDto } from '@revolut/rwa-core-types'

import { useCardsTranslation } from '../../../../../../../hooks'
import { formatDeliveryPrice } from '../../utils'
import { DeliveryMethodPrice, DeliveryMethodPriceFreeLabel } from '../styled'

type DeliveryMethodReducedPriceLabelProps = {
  isFreeDelivery: boolean
  isReducedPrice: boolean
  originalFee?: MoneyDto
  fee: MoneyDto
}

export const DeliveryMethodReducedPriceLabel: FC<DeliveryMethodReducedPriceLabelProps> =
  ({ isFreeDelivery, isReducedPrice, fee }) => {
    const t = useCardsTranslation()

    if (isFreeDelivery) {
      return (
        <DeliveryMethodPriceFreeLabel>
          {t('CardOrdering.DeliveryMethodsScreen.deliveryMethod.free')}
        </DeliveryMethodPriceFreeLabel>
      )
    }

    if (isReducedPrice) {
      return <DeliveryMethodPrice>{formatDeliveryPrice(fee)}</DeliveryMethodPrice>
    }

    return null
  }
