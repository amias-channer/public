import { FC } from 'react'
import { Group, DetailsCell } from '@revolut/ui-kit'

import { CardFee, MoneyDto } from '@revolut/rwa-core-types'
import { formatMoney, getCurrentIntlLocale } from '@revolut/rwa-core-utils'

import { useCardsTranslation } from '../../../../../hooks'
import { getTotalDeliveryAmount } from '../utils'

type DeliveryMethodsSummaryProps = {
  cardFee: CardFee
  deliveryMethodFee: MoneyDto
}

export const DeliveryMethodsSummary: FC<DeliveryMethodsSummaryProps> = ({
  cardFee,
  deliveryMethodFee,
}) => {
  const t = useCardsTranslation()

  const cardPrice = formatMoney(cardFee.amount, cardFee.currency, getCurrentIntlLocale())
  const totalPrice = formatMoney(
    getTotalDeliveryAmount(cardFee, deliveryMethodFee),
    deliveryMethodFee.currency,
    getCurrentIntlLocale(),
  )

  return (
    <Group>
      <DetailsCell>
        <DetailsCell.Title>
          {t('CardOrdering.DeliveryMethodsScreen.summary.extraFee')}
        </DetailsCell.Title>
        <DetailsCell.Content>{cardPrice}</DetailsCell.Content>
      </DetailsCell>
      <DetailsCell>
        <DetailsCell.Title>
          {t('CardOrdering.DeliveryMethodsScreen.summary.total')}
        </DetailsCell.Title>
        <DetailsCell.Content>{totalPrice}</DetailsCell.Content>
      </DetailsCell>
    </Group>
  )
}
