import format from 'date-fns/format'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Color, Text } from '@revolut/ui-kit'

import { CardItemDto } from '@revolut/rwa-core-types'
import { DateFormat } from '@revolut/rwa-core-utils'

import { CARDS_I18N_NAMESPACE } from '../../../../../helpers'

type CardListItemDescriptionProps = {
  cardData: CardItemDto
  cardStateLabel?: string
  textColor?: Color
}

export const CardListItemDescription: FC<CardListItemDescriptionProps> = ({
  cardData,
  cardStateLabel,
  textColor,
}) => {
  const { t } = useTranslation(CARDS_I18N_NAMESPACE)

  if (cardStateLabel) {
    return <Text color={textColor}>{cardStateLabel}</Text>
  }

  return (
    <>
      {t('CardListItemDescription.expiresOn', {
        date: format(new Date(cardData.expiryDate), DateFormat.CardExpireDateShort),

        interpolation: {
          escapeValue: false,
        },
      })}
    </>
  )
}
