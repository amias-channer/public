import { useMemo } from 'react'
import * as Icons from '@revolut/icons'
import { Color } from '@revolut/ui-kit'

import isPast from 'date-fns/isPast'
import { useTranslation } from 'react-i18next'

import { CardItemDto } from '@revolut/rwa-core-types'
import {
  formatLocaleISODate,
  getCurrentLocale,
  normalizeLocale,
} from '@revolut/rwa-core-utils'

import {
  CARDS_I18N_NAMESPACE,
  CardDeliveryState,
  getCardDeliveryState,
  isCardPaymentPending,
  isLikelyDelivered,
} from '../../../../../helpers'
import { checkIsCardFrozen } from '../../../utils'

type GetCardStateContentReturn = {
  Icon: Icons.IconComponentType
  label: string
  color: Color
} | null

export const isCardExpired = (cardData: CardItemDto) =>
  isPast(new Date(cardData.expiryDate))

export const isCardPreExpired = (cardData: CardItemDto) => cardData.preexpired

const addCardDescriptionKey = (key: string) => `CardListItemDescription.${key}`

export const useGetCardStateContent = (
  cardData?: CardItemDto,
): GetCardStateContentReturn => {
  const { t, i18n } = useTranslation(CARDS_I18N_NAMESPACE)

  return useMemo(() => {
    if (!cardData) {
      return null
    }

    if (checkIsCardFrozen(cardData)) {
      return {
        Icon: Icons.Snowflake,
        label: t(addCardDescriptionKey('frozen')),
        color: 'error',
      }
    }

    const cardDeliveryState = getCardDeliveryState(cardData)

    const isCardDelivering = cardDeliveryState === CardDeliveryState.Delivering
    const correctLocale = normalizeLocale(i18n.language) || getCurrentLocale()

    if (isCardPaymentPending(cardData)) {
      return {
        Icon: Icons.InfoSign,
        label: t(addCardDescriptionKey('paymentRequired')),
        color: 'warning',
      }
    }

    if (isCardDelivering && cardData.delivery?.edt) {
      return {
        Icon: Icons.Time,
        label: t(addCardDescriptionKey('expected'), {
          date: formatLocaleISODate(cardData.delivery?.edt, correctLocale),
        }),
        color: 'warning',
      }
    }

    if (isLikelyDelivered(cardDeliveryState)) {
      return {
        Icon: Icons.InfoSign,
        label: t(addCardDescriptionKey('activationRequired')),
        color: 'warning',
      }
    }

    if (isCardPreExpired(cardData)) {
      return {
        Icon: Icons.InfoSign,
        label: t(addCardDescriptionKey('expires'), {
          date: formatLocaleISODate(cardData.expiryDate, correctLocale),
        }),
        color: 'warning',
      }
    }

    if (isCardExpired(cardData)) {
      return {
        Icon: Icons.InfoSign,
        label: t(addCardDescriptionKey('expired'), {
          date: formatLocaleISODate(cardData.expiryDate, correctLocale),
        }),
        color: 'warning',
      }
    }

    return null
  }, [cardData, i18n.language, t])
}
