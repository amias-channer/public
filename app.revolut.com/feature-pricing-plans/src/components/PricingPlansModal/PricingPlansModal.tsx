import { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Popup } from '@revolut/ui-kit'
import isEmpty from 'lodash/isEmpty'

import { BaseModalProps, Spacer, useModal } from '@revolut/rwa-core-components'
import {
  CheckoutPricingPlanData,
  PricingPlanDto,
  PricingPlansBillingCode,
} from '@revolut/rwa-core-types'
import { checkRequired, I18nNamespace } from '@revolut/rwa-core-utils'

import { I18_NAMESPACE } from '../../constants'
import { FeatureList } from '../FeatureList'
import { PricingPlanBillingDialog } from '../PricingPlanBillingDialog'
import { PricingPlanInsuranceDetailsPopup } from '../PricingPlanInsuranceDetails'
import { PricingPlansCarousel } from '../PricingPlansCarousel'
import { PricingPlansCarouselSkeleton } from '../PricingPlansCarouselSkeleton'
import { useScrollState } from './hooks'
import { PricingPlansModalActionButton } from './PricingPlansModalActionButton'
import { PricingPlansTabs } from './PricingPlansTabs'
import { PricingPlansModalHeader } from './PricinPlansModalHeader'

export type PricingPlansModalProps = BaseModalProps & {
  pricingPlans: PricingPlanDto[]
  onPricingPlanSelected: (planData: CheckoutPricingPlanData) => void
}

const APPEARANCE_TITLE_SCROLL_TOP = 32
const DISAPPEARANCE_TITLE_SCROLL_TOP = 31

export const PricingPlansModal: FC<PricingPlansModalProps> = ({
  isOpen,
  pricingPlans,
  onPricingPlanSelected,
  onRequestClose,
}) => {
  const { t } = useTranslation([I18_NAMESPACE, I18nNamespace.Common])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const pricingPlanDataRef = useRef<CheckoutPricingPlanData>()
  const [openBillingDialog, billingDialogProps] = useModal()
  const [openInsuranceDetailsDialog, insuranceDetailsDialogProps] = useModal()

  const [isPricingPlansTabsVisible, checkPricingPlanTabsVisible] = useScrollState({
    offsetIn: APPEARANCE_TITLE_SCROLL_TOP,
    offsetOut: DISAPPEARANCE_TITLE_SCROLL_TOP,
  })

  useEffect(() => {
    if (isOpen) {
      checkPricingPlanTabsVisible(0)
      setCurrentSlideIndex(0)
    }
  }, [checkPricingPlanTabsVisible, isOpen])

  const handlePopupScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    checkPricingPlanTabsVisible(event.currentTarget.scrollTop)
  }

  const handlePricingPlanSelected = (
    pricingPlanId: string,
    pricingPlanBillingCode: PricingPlansBillingCode,
  ) => {
    pricingPlanDataRef.current = {
      id: pricingPlanId,
      billingCode: pricingPlanBillingCode,
    }
    openInsuranceDetailsDialog()
  }

  const handlePricingPlanInsuranceAccepted = () => {
    onRequestClose()
    onPricingPlanSelected(
      checkRequired(
        pricingPlanDataRef.current,
        'pricing plan should be selected before policy popup',
      ),
    )
  }

  const pricingPlansCodes = pricingPlans.map((pricingPlan) => pricingPlan.code)

  const selectedPricingPlan = pricingPlans[currentSlideIndex]

  const isPricingPlansCodesEmpty = isEmpty(pricingPlansCodes)

  return (
    <>
      <Popup
        variant="modal-view"
        isOpen={isOpen}
        shouldKeepMaxHeight
        onExit={onRequestClose}
        onScroll={handlePopupScroll}
      >
        <PricingPlansModalHeader onCloseClick={onRequestClose}>
          {t(`${I18nNamespace.Common}:upgrade`)}
        </PricingPlansModalHeader>
        {!isPricingPlansCodesEmpty && (
          <PricingPlansTabs
            visible={isPricingPlansTabsVisible}
            currentTabIndex={currentSlideIndex}
            pricingPlansCodes={pricingPlansCodes}
            onTabChange={setCurrentSlideIndex}
          />
        )}
        {!isPricingPlansCodesEmpty ? (
          <PricingPlansCarousel
            plans={pricingPlansCodes}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={setCurrentSlideIndex}
          />
        ) : (
          <PricingPlansCarouselSkeleton />
        )}
        <Spacer h="16px" />
        {selectedPricingPlan && (
          <FeatureList selectedPricingPlanCode={selectedPricingPlan.code} />
        )}
        <Popup.Actions>
          {selectedPricingPlan && (
            <PricingPlansModalActionButton
              pricingPlan={selectedPricingPlan}
              onClick={openBillingDialog}
            />
          )}
        </Popup.Actions>
      </Popup>
      {selectedPricingPlan && (
        <PricingPlanBillingDialog
          {...billingDialogProps}
          pricingPlan={selectedPricingPlan}
          onSubmit={handlePricingPlanSelected}
        />
      )}
      {selectedPricingPlan && (
        <PricingPlanInsuranceDetailsPopup
          key={selectedPricingPlan.id}
          {...insuranceDetailsDialogProps}
          pricingPlan={selectedPricingPlan}
          onAccepted={handlePricingPlanInsuranceAccepted}
        />
      )}
    </>
  )
}
