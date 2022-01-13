import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@revolut/ui-kit'

import { CardFee, MoneyDto } from '@revolut/rwa-core-types'
import { I18nNamespace, formatMoney, getCurrentIntlLocale } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'
import { getTotalDeliveryAmount } from '../utils'

type DeliveryMethodsScreenButtonProps = {
  cardFee?: CardFee
  deliveryMethodFee: MoneyDto
  isLoading: boolean
  isUpgradable: boolean
  onSubmit: VoidFunction
}

export const DeliveryMethodsScreenButton: FC<DeliveryMethodsScreenButtonProps> = ({
  cardFee,
  deliveryMethodFee,
  isLoading,
  isUpgradable,
  onSubmit,
}) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])

  const totalDeliveryAmount = cardFee
    ? getTotalDeliveryAmount(cardFee, deliveryMethodFee)
    : 0

  const totalDeliveryPrice =
    totalDeliveryAmount > 0
      ? formatMoney(
          totalDeliveryAmount,
          deliveryMethodFee.currency,
          getCurrentIntlLocale(),
        )
      : t('common:free')

  return (
    <Button elevated pending={isLoading} disabled={isLoading} onClick={onSubmit}>
      {isUpgradable
        ? t('common:plan.upgrade.suggestion')
        : t('CardOrdering.DeliveryMethodsScreen.button', {
            price: totalDeliveryPrice,
          })}
    </Button>
  )
}
