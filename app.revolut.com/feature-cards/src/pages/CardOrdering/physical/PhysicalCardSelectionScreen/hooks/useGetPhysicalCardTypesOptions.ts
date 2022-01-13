import groupBy from 'lodash/groupBy'
import { useTranslation } from 'react-i18next'
import * as Sentry from '@sentry/react'

import { CardBrand, CardDesignDto } from '@revolut/rwa-core-types'
import { I18nNamespace } from '@revolut/rwa-core-utils'

import { getCardOrderDesignImage } from '../../../../../helpers'
import { useGetPhysicalCardDesigns } from '../../hooks'
import { CARD_DESIGN_TEXT } from '../cardDesignText'
import { CardTier, PhysicalCardDesignGroup } from '../constants'
import { PhysicalCardTypesOptions } from '../types'
import { isCardColorCrypto, isCardCodeFlags, getCardsColourAsset } from '../utils'

const cardDesignGroupMapper = (cardDesign: CardDesignDto): PhysicalCardDesignGroup => {
  if (isCardCodeFlags(cardDesign.code)) {
    return PhysicalCardDesignGroup.Flags
  }

  if (isCardColorCrypto(cardDesign.color)) {
    return PhysicalCardDesignGroup.Crypto
  }

  switch (cardDesign.tier) {
    case CardTier.Standard:
      return PhysicalCardDesignGroup.Standard
    case CardTier.Plus:
      return PhysicalCardDesignGroup.Plus
    case CardTier.Premium:
      return PhysicalCardDesignGroup.Premium
    case CardTier.Metal:
      return PhysicalCardDesignGroup.Metal
    default:
      Sentry.captureException(
        new Error(`card tier: ${cardDesign.tier} was not implemented`),
      )
      return PhysicalCardDesignGroup.Standard
  }
}

const checkMaestroAndReplaceForMastercard = (cardBrand: string) => {
  if (cardBrand === CardBrand.Maestro) {
    return CardBrand.Mastercard
  }

  return cardBrand
}

export const useGetPhysicalCardTypesOptions = ():
  | PhysicalCardTypesOptions
  | undefined => {
  const { i18n } = useTranslation(I18nNamespace.Common)
  const { physicalCardDesigns } = useGetPhysicalCardDesigns()

  if (!physicalCardDesigns) return undefined

  const filteredPhysicalCardDesigns = physicalCardDesigns.filter(
    (cardDesign) =>
      i18n.exists(`common:card_name.${cardDesign.code}`) &&
      CARD_DESIGN_TEXT[cardDesign.code.toUpperCase()],
  )

  return groupBy(
    filteredPhysicalCardDesigns.map((cardDesign) => ({
      ...cardDesign,
      colorSrc: getCardsColourAsset(cardDesign.code),
      groupName: cardDesignGroupMapper(cardDesign),
      imgSrc: getCardOrderDesignImage(
        checkMaestroAndReplaceForMastercard(cardDesign.brands[0]).toLowerCase(),
        cardDesign.code,
      ),
    })),
    'groupName',
  )
}
