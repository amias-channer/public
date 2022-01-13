import { FC } from 'react'
import { Button, Popup, Text } from '@revolut/ui-kit'

import { useModal } from '@revolut/rwa-core-components'
import { CardFee, CheckoutPricingPlanData, PricingPlanDto } from '@revolut/rwa-core-types'
import { formatMoney, getAsset, getCurrentLocale } from '@revolut/rwa-core-utils'
import {
  PricingPlansDialog,
  isPricingPlanMetal,
  useGetCurrentPricingPlan,
} from '@revolut/rwa-feature-pricing-plans'

import { useCardsTranslation } from '../../../../hooks'
import { checkIsCardDesignInPricingPlan } from '../../utils'
import {
  PopupContent,
  PopupTextContent,
  PopupCardImage,
  PopupCardImageContainer,
} from './styled'

export enum SpareCardType {
  Virtual = 'Virtual',
  Physical = 'Physical',
}

type PhysicalSpareCard = {
  spareCardType: SpareCardType.Physical
  cardDesignBrand: string
  cardDesignCode: string
}

type VirtualSpareCard = {
  spareCardType: SpareCardType.Virtual
}

export type SpareCardPopupProps = {
  price: CardFee
  isOpen: boolean
  onRequestClose: VoidFunction
  onOrderClick: VoidFunction
  onPricingPlanSelected: (pricingPlanData: CheckoutPricingPlanData) => void
} & (PhysicalSpareCard | VirtualSpareCard)

const getAssetUrl = (spareCardType: SpareCardType) =>
  getAsset(`card_ordering/spare_card_${spareCardType.toLowerCase()}.svg`)

export const SpareCardPopup: FC<SpareCardPopupProps> = (props) => {
  const {
    spareCardType,
    price,
    isOpen,
    onRequestClose,
    onOrderClick,
    onPricingPlanSelected,
  } = props

  const t = useCardsTranslation()
  const { currentPricingPlan, isCurrentPricingPlanFetching } = useGetCurrentPricingPlan()

  const isCurrentPricingPlanMetal =
    currentPricingPlan && isPricingPlanMetal(currentPricingPlan)

  const [showPricingPlansDialog, pricingPlansDialogProps] = useModal()

  const handleOrderClick = () => {
    onOrderClick()
    onRequestClose()
  }

  const handlePricingPlanSelected = (pricingPlanData: CheckoutPricingPlanData) => {
    onPricingPlanSelected(pricingPlanData)
    onRequestClose()
  }

  const pricingPlanCardDesignsFilter = (pricingPlan: PricingPlanDto) => {
    if (props.spareCardType !== SpareCardType.Physical) {
      return false
    }

    const { cardDesignBrand, cardDesignCode } = props

    return checkIsCardDesignInPricingPlan({
      pricingPlan,
      cardDesignBrand,
      cardDesignCode,
    })
  }

  const formattedCardPrice = formatMoney(price.amount, price.currency, getCurrentLocale())
  const spareCardTypeLowerCased = spareCardType.toLowerCase()

  return (
    <>
      <Popup
        isOpen={isOpen}
        variant="colorful"
        shouldKeepMaxHeight
        onExit={onRequestClose}
      >
        <Popup.Header>
          <Popup.CloseButton aria-label="Close" />
          <Text variant="h1" use="div">
            {t('CardOrdering.SpareCardPopup.title', { cardPrice: formattedCardPrice })}
          </Text>
        </Popup.Header>
        <PopupContent>
          <PopupTextContent>
            {t(`CardOrdering.SpareCardPopup.content.${spareCardTypeLowerCased}`)}
          </PopupTextContent>
          <PopupCardImageContainer>
            <PopupCardImage src={getAssetUrl(spareCardType)} />
          </PopupCardImageContainer>
        </PopupContent>
        <Popup.Actions>
          <Button variant="white" elevated onClick={handleOrderClick}>
            {t(`CardOrdering.SpareCardPopup.button.order.${spareCardTypeLowerCased}`, {
              cardPrice: formattedCardPrice,
            })}
          </Button>
          {!isCurrentPricingPlanMetal && !isCurrentPricingPlanFetching && (
            <Button variant="black" onClick={showPricingPlansDialog}>
              {t('CardOrdering.SpareCardPopup.button.upgrade')}
            </Button>
          )}
        </Popup.Actions>
      </Popup>
      <PricingPlansDialog
        {...pricingPlansDialogProps}
        pricingPlansFilterFn={
          spareCardType === SpareCardType.Physical
            ? pricingPlanCardDesignsFilter
            : undefined
        }
        onPricingPlanSelected={handlePricingPlanSelected}
      />
    </>
  )
}
