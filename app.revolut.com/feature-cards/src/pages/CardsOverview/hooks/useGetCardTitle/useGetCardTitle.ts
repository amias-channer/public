import { useTranslation } from 'react-i18next'

import { CardItemDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { getCardI18nKey } from '../../../../helpers'

export const useGetCardTitle = (cardData?: CardItemDto) => {
  const { t, i18n } = useTranslation(I18nNamespace.Common)

  if (!cardData) {
    return ''
  }

  const cardDesignI18nKey = getCardI18nKey(cardData.design)
  const cardDesignTranslation = i18n.exists(
    `${I18nNamespace.Common}:${cardDesignI18nKey}`,
  )
    ? t(cardDesignI18nKey)
    : t(getCardI18nKey('generic'))

  return cardData.label || cardDesignTranslation
}
