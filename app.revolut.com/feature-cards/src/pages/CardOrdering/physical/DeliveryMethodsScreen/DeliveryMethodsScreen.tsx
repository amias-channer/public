import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Layout } from '@revolut/ui-kit'

import { Spacer, useModal } from '@revolut/rwa-core-components'
import {
  AddressDto,
  CardDesignDto,
  CheckoutPricingPlanData,
  DeliveryMethodDto,
  DeliveryMethodName,
  PricingPlanFeature,
  PricingPlanDto,
} from '@revolut/rwa-core-types'
import { checkRequired, I18nNamespace } from '@revolut/rwa-core-utils'
import {
  useGetLowPriorityPlanWithFeature,
  PricingPlansDialog,
} from '@revolut/rwa-feature-pricing-plans'

import { CARDS_I18N_NAMESPACE } from '../../../../helpers'
import { useGetDeliveryMethods, useGetPhysicalCardPricing } from '../../hooks'
import { DeliveryMethods } from './DeliveryMethods'
import { DeliveryMethodsScreenButton } from './DeliveryMethodsScreenButton'
import { DeliveryMethodsScreenSkeleton } from './DeliveryMethodsScreenSkeleton'
import { DeliveryMethodsSummary } from './DeliveryMethodsSummary'
import { getDefaultDeliveryMethod } from './utils'
import { checkIsCardDesignInPricingPlan } from '../../utils'

type DeliveryMethodsScreenProps = {
  address: AddressDto
  cardDesign: CardDesignDto
  planId?: string
  isCardCheckoutProcessing: boolean
  onBackClick: VoidFunction
  onSubmit: (
    deliveryMethodName: DeliveryMethodName,
    pricingPlanData?: CheckoutPricingPlanData,
  ) => void
}

export const DeliveryMethodsScreen: FC<DeliveryMethodsScreenProps> = ({
  address,
  cardDesign,
  planId,
  isCardCheckoutProcessing,
  onBackClick,
  onSubmit,
}) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])
  const { allDeliveryMethods } = useGetDeliveryMethods(cardDesign, address, planId)
  const [showPricingPlansDialog, pricingPlansDialogProps] = useModal()
  const { physicalCardFee, physicalCardFeeFetching } = useGetPhysicalCardPricing({
    cardDesign: cardDesign.code.toUpperCase(),
    planId,
  })
  const lowPriorityPricingPlanWithExpressDelivery = useGetLowPriorityPlanWithFeature(
    PricingPlanFeature.FreeExpressDelivery,
  )

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<DeliveryMethodDto>()

  useEffect(() => {
    if (allDeliveryMethods) {
      setSelectedDeliveryMethod(getDefaultDeliveryMethod(allDeliveryMethods))
    }
  }, [allDeliveryMethods])

  const isUpgradable =
    (selectedDeliveryMethod &&
      allDeliveryMethods?.upgradableDeliveryMethods?.includes(selectedDeliveryMethod)) ??
    false

  const handleMethodSubmit = () => {
    if (isUpgradable) {
      showPricingPlansDialog()
    } else {
      onSubmit(
        checkRequired(
          selectedDeliveryMethod?.name,
          'selectedDeliveryMethod can not be empty',
        ),
      )
    }
  }

  const handlePricingPlanSubmit = (pricingPlanData: CheckoutPricingPlanData) => {
    onSubmit(
      checkRequired(
        selectedDeliveryMethod?.name,
        'selectedDeliveryMethod can not be empty',
      ),
      pricingPlanData,
    )
  }

  const pricingPlanCardDesignsFilter = (pricingPlan: PricingPlanDto) => {
    return checkIsCardDesignInPricingPlan({
      pricingPlan,
      cardDesignBrand: cardDesign.brands[0],
      cardDesignCode: cardDesign.code,
    })
  }

  return (
    <Layout>
      <Layout.Main>
        <Header variant="form">
          <Header.BackButton aria-label="Back" onClick={onBackClick} />

          <Header.Title>{t('CardOrdering.DeliveryMethodsScreen.title')}</Header.Title>
        </Header>
        {!allDeliveryMethods ? (
          <DeliveryMethodsScreenSkeleton />
        ) : (
          <>
            <DeliveryMethods
              allDeliveryMethods={allDeliveryMethods}
              selectedDeliveryMethod={selectedDeliveryMethod}
              onDeliveryMethodChange={setSelectedDeliveryMethod}
            />
            {physicalCardFee && physicalCardFee.amount > 0 && selectedDeliveryMethod && (
              <>
                <Spacer h="16px" />
                <DeliveryMethodsSummary
                  cardFee={physicalCardFee}
                  deliveryMethodFee={selectedDeliveryMethod.fee}
                />
              </>
            )}
          </>
        )}
      </Layout.Main>
      <Layout.Actions>
        {selectedDeliveryMethod && (
          <DeliveryMethodsScreenButton
            cardFee={physicalCardFee}
            deliveryMethodFee={selectedDeliveryMethod.fee}
            isLoading={physicalCardFeeFetching || isCardCheckoutProcessing}
            isUpgradable={isUpgradable}
            onSubmit={handleMethodSubmit}
          />
        )}
      </Layout.Actions>
      <PricingPlansDialog
        {...pricingPlansDialogProps}
        minPriority={lowPriorityPricingPlanWithExpressDelivery?.priority}
        pricingPlansFilterFn={pricingPlanCardDesignsFilter}
        onPricingPlanSelected={handlePricingPlanSubmit}
      />
    </Layout>
  )
}
