import { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Header, Layout } from '@revolut/ui-kit'

import { Spacer, useModal } from '@revolut/rwa-core-components'
import {
  CardDesignDto,
  CheckoutPricingPlanData,
  PricingPlanDto,
} from '@revolut/rwa-core-types'
import { checkRequired } from '@revolut/rwa-core-utils'
import {
  PricingPlansDialog,
  useGetPricingPlans,
} from '@revolut/rwa-feature-pricing-plans'

import { useCardsTranslation } from '../../../../hooks'
import { checkIsCardDesignInPricingPlan } from '../../utils'
import { useGetPhysicalCardTypesOptions } from './hooks'
import { PhysicalCardDesignText } from './PhysicalCardDesignText'
import { PhysicalCardsCarousel } from './PhysicalCardsCarousel'
import { PhysicalCardsColorPicker } from './PhysicalCardsColorPicker'
import { PhysicalCardSelectionScreenAction } from './PhysicalCardSelectionScreenAction'
import { HeaderStyled } from './styled'
import { DesignOptionsIndexes } from './types'
import {
  getAvailableCardDesignGroups,
  getPhysicalCardsGroupKey,
  getPricingPlanByCardTier,
} from './utils'

type PhysicalCardSelectionScreenProps = {
  onSubmit: (cardDesign: CardDesignDto, pricingPlanData?: CheckoutPricingPlanData) => void
}

export const PhysicalCardSelectionScreen: FC<PhysicalCardSelectionScreenProps> = ({
  onSubmit,
}) => {
  const history = useHistory()
  const t = useCardsTranslation()
  const physicalCardTypesOptions = useGetPhysicalCardTypesOptions()
  const [showPricingPlansDialog, pricingPlansDialogProps] = useModal()
  const { pricingPlans } = useGetPricingPlans()

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0)
  const [selectedDesignOptionsIndexes, setSelectedDesignIndexes] =
    useState<DesignOptionsIndexes>({})

  const handleBackButtonClick = () => {
    history.goBack()
  }

  const availableCardDesignGroups = getAvailableCardDesignGroups(physicalCardTypesOptions)

  const handleDesignOptionsIndexChange = (index: number | null) => {
    setSelectedDesignIndexes({
      ...selectedDesignOptionsIndexes,
      [availableCardDesignGroups[selectedGroupIndex]]: checkRequired(
        index,
        '"index" can not be null',
      ),
    })
  }

  const selectedGroup = availableCardDesignGroups[selectedGroupIndex]
  const selectedDesignOptionsIndex = selectedDesignOptionsIndexes[selectedGroup] ?? 0
  const selectedDesignOptions =
    physicalCardTypesOptions?.[selectedGroup][selectedDesignOptionsIndex]

  const pricingPlanCardDesignsFilter = (pricingPlan: PricingPlanDto) => {
    if (!selectedDesignOptions) {
      return false
    }

    return checkIsCardDesignInPricingPlan({
      pricingPlan,
      cardDesignBrand: selectedDesignOptions.brands[0],
      cardDesignCode: selectedDesignOptions.code,
    })
  }

  const handleSubmit = (planData?: CheckoutPricingPlanData) => {
    if (!selectedDesignOptions) {
      return
    }

    onSubmit(selectedDesignOptions, planData)
  }

  return (
    <Layout>
      <Layout.Main>
        <HeaderStyled variant="item">
          <Header.BackButton aria-label="Back" onClick={handleBackButtonClick} />
          <Header.Title>
            {selectedGroup ? t(getPhysicalCardsGroupKey(selectedGroup)) : ''}
          </Header.Title>
        </HeaderStyled>
        {physicalCardTypesOptions && (
          <PhysicalCardsCarousel
            availableCardDesignGroups={availableCardDesignGroups}
            selectedIndex={selectedGroupIndex}
            selectedDesignIndexes={selectedDesignOptionsIndexes}
            physicalCardTypesOptions={physicalCardTypesOptions}
            onCarouselIndexChange={setSelectedGroupIndex}
          />
        )}
        <Spacer h="24px" />
        {selectedDesignOptions && (
          <PhysicalCardDesignText cardCode={selectedDesignOptions.code} />
        )}
        <Spacer h={{ _: '32px', md: '40px' }} />
        {physicalCardTypesOptions && (
          <PhysicalCardsColorPicker
            selectedIndex={selectedDesignOptionsIndex}
            selectedGroup={physicalCardTypesOptions[selectedGroup]}
            onIndexChange={handleDesignOptionsIndexChange}
          />
        )}
        <Layout.Actions>
          {selectedDesignOptions && (
            <PhysicalCardSelectionScreenAction
              designOptions={selectedDesignOptions}
              onPlanUpgradeDialogOpen={showPricingPlansDialog}
              onSubmit={handleSubmit}
            />
          )}
        </Layout.Actions>
      </Layout.Main>
      {pricingPlans && selectedDesignOptions && (
        <PricingPlansDialog
          {...pricingPlansDialogProps}
          minPriority={
            getPricingPlanByCardTier(pricingPlans, selectedDesignOptions.tier)?.priority
          }
          pricingPlansFilterFn={pricingPlanCardDesignsFilter}
          onPricingPlanSelected={handleSubmit}
        />
      )}
    </Layout>
  )
}
