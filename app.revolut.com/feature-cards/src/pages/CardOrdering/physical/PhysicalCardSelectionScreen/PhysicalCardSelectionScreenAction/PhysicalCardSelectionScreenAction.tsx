import { FC } from 'react'
import * as Icons from '@revolut/icons'
import { Button, Flex, Footer, Text } from '@revolut/ui-kit'

import { Spacer, useModal } from '@revolut/rwa-core-components'
import { CardMaterial, CheckoutPricingPlanData } from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'

import { SpareCardPopup, SpareCardType } from '../../../components'
import { useCheckCardLimit } from '../../../hooks'
import { MetalCardsLimitReachedPopup, PhysicalCardsLimitReachedPopup } from '../../popups'
import { PhysicalCardTypeOptions } from '../types'
import {
  useGetActionSettings,
  useGetPhysicalCardPricingForCurrentPricingPlan,
} from './hooks'

type PhysicalCardSelectionScreenActionProps = {
  designOptions: PhysicalCardTypeOptions
  onPlanUpgradeDialogOpen: VoidFunction
  onSubmit: (planData?: CheckoutPricingPlanData) => void
}

export enum PhysicalCardSelectionScreenActionLabels {
  ButtonPending = 'PhysicalCardSelectionScreenActionButton',
  ButtonTestId = 'PhysicalCardSelectionScreenActionButton',
  FooterTestId = 'PhysicalCardSelectionScreenActionFooter',
  FooterIconTestId = 'PhysicalCardSelectionScreenActionFooterIcon',
  FooterSpacerTestId = 'PhysicalCardSelectionScreenActionFooterSpacer',
}

const checkIsCardMetal = (cardMaterial: CardMaterial) =>
  cardMaterial === CardMaterial.Metal

export const PhysicalCardSelectionScreenAction: FC<PhysicalCardSelectionScreenActionProps> =
  ({ designOptions, onPlanUpgradeDialogOpen, onSubmit }) => {
    const actionSettings = useGetActionSettings(designOptions)
    const { physicalCardFee, physicalCardFeeFetching } =
      useGetPhysicalCardPricingForCurrentPricingPlan(designOptions.code)
    const { isFetching: isCardLimitChecking, isError: isCardUnavailable } =
      useCheckCardLimit({
        design: designOptions.code,
        brand: designOptions.brands[0],
      })

    const [showLimitReachedModal, limitReachedModalProps] = useModal()
    const [showSpareCardPopup, spareCardPopupProps] = useModal()

    const { buttonVariant, cta, footerText, requiresPlanUpgrade } = actionSettings ?? {}

    const isCardMetal = checkIsCardMetal(designOptions.material)

    const handleButtonClick = () => {
      const isCardPaid =
        checkRequired(
          physicalCardFee,
          'physical card price should be fetched before submitting',
        ).amount > 0

      if (isCardUnavailable) {
        showLimitReachedModal()
      } else if (requiresPlanUpgrade) {
        onPlanUpgradeDialogOpen()
      } else if (isCardPaid) {
        showSpareCardPopup()
      } else {
        onSubmit()
      }
    }

    const isLoadingButton =
      !actionSettings || isCardLimitChecking || physicalCardFeeFetching

    return (
      <>
        <Button
          data-testid={PhysicalCardSelectionScreenActionLabels.ButtonTestId}
          width="100%"
          labelPending={PhysicalCardSelectionScreenActionLabels.ButtonTestId}
          pending={isLoadingButton}
          disabled={isLoadingButton}
          variant={buttonVariant}
          elevated
          onClick={handleButtonClick}
        >
          {cta}
        </Button>
        {footerText ? (
          <Flex
            data-testid={PhysicalCardSelectionScreenActionLabels.FooterTestId}
            alignItems="center"
            justifyContent="center"
            mt="8px"
          >
            {requiresPlanUpgrade && (
              <Icons.Premium
                data-testid={PhysicalCardSelectionScreenActionLabels.FooterIconTestId}
                size="12px"
              />
            )}
            <Footer>
              <Text
                ml={requiresPlanUpgrade ? '8px' : '0'}
                color={requiresPlanUpgrade ? 'foreground' : 'inherit'}
              >
                {footerText}
              </Text>
            </Footer>
          </Flex>
        ) : (
          <Spacer
            data-testid={PhysicalCardSelectionScreenActionLabels.FooterSpacerTestId}
            h="28px"
          />
        )}
        {isCardMetal ? (
          <MetalCardsLimitReachedPopup {...limitReachedModalProps} />
        ) : (
          <PhysicalCardsLimitReachedPopup {...limitReachedModalProps} />
        )}
        {physicalCardFee && (
          <SpareCardPopup
            {...spareCardPopupProps}
            price={physicalCardFee}
            spareCardType={SpareCardType.Physical}
            cardDesignBrand={designOptions.brands[0]}
            cardDesignCode={designOptions.code}
            onOrderClick={onSubmit}
            onPricingPlanSelected={onSubmit}
          />
        )}
      </>
    )
  }
