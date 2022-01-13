import { useTranslation } from 'react-i18next'
import capitalize from 'lodash/capitalize'

import { formatMoney, getCurrentLocale, I18nNamespace } from '@revolut/rwa-core-utils'
import { CheckoutItemProps } from '@revolut/rwa-feature-topup'

import { CardCheckoutItem } from '../types'

export const useFormatCheckoutItems = (checkoutItems: CardCheckoutItem[]) => {
  const { t } = useTranslation(I18nNamespace.Common)

  return checkoutItems.map((checkoutItem) => {
    const formattedCheckoutItem: CheckoutItemProps = {
      title: checkoutItem.title,
      fee: formatMoney(
        checkoutItem.fee.amount,
        checkoutItem.fee.currency,
        getCurrentLocale(),
      ),
    }

    if (checkoutItem.discountFee) {
      formattedCheckoutItem.discountFee =
        checkoutItem.discountFee.amount === 0
          ? capitalize(t('free'))
          : formatMoney(
              checkoutItem.discountFee.amount,
              checkoutItem.discountFee.currency,
              getCurrentLocale(),
            )
    }

    return formattedCheckoutItem
  })
}
