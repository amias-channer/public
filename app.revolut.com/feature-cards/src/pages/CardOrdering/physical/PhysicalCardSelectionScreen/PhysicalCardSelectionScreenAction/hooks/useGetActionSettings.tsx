import { useMemo } from 'react'
import { useTranslation, Trans, TFunction } from 'react-i18next'
import { ButtonVariant } from '@revolut/ui-kit'
import * as Sentry from '@sentry/react'

import { MoneyDto, PricingPlanDto } from '@revolut/rwa-core-types'
import { formatMoney, getCurrentIntlLocale, I18nNamespace } from '@revolut/rwa-core-utils'
import {
  isCurrentPricingPlanBelowRequired,
  isPricingPlanMetal,
  isPricingPlanPlus,
  isPricingPlanPremium,
  useGetCurrentPricingPlan,
  useGetPricingPlans,
} from '@revolut/rwa-feature-pricing-plans'

import { CARDS_I18N_NAMESPACE } from '../../../../../../helpers'
import { useGetPhysicalCardsPricing } from '../../../../hooks'
import { PhysicalCardDesignGroup } from '../../constants'
import { PhysicalCardTypeOptions } from '../../types'
import { StrikedPrice } from '../styled'

const formatCardPrice = (cardPrice: MoneyDto) =>
  formatMoney(cardPrice.amount, cardPrice.currency, getCurrentIntlLocale())

const getCTAKey = (isCardFree: boolean) => {
  if (isCardFree) {
    return 'CardOrdering.PhysicalCardSelectionScreen.cta.free'
  }

  return 'CardOrdering.PhysicalCardSelectionScreen.cta.paid'
}

const getFooterText = (
  t: TFunction<(typeof CARDS_I18N_NAMESPACE | typeof I18nNamespace.Common)[]>,
  isPlanUpgradeRequired: boolean,
  planName?: string,
) => {
  if (isPlanUpgradeRequired) {
    return t('CardOrdering.PhysicalCardSelectionScreen.footer.upgrade', { planName })
  }

  return t('CardOrdering.PhysicalCardSelectionScreen.footer.deliveryFee')
}

const isPlanUpgradeRequired = (
  currentPricingPlan: PricingPlanDto,
  requiredPricingPlan?: PricingPlanDto,
) => {
  return requiredPricingPlan
    ? isCurrentPricingPlanBelowRequired(currentPricingPlan, requiredPricingPlan)
    : false
}

export const useGetActionSettings = (designOptions: PhysicalCardTypeOptions) => {
  const { t } = useTranslation([CARDS_I18N_NAMESPACE, I18nNamespace.Common])
  const { pricingPlans } = useGetPricingPlans()
  const { currentPricingPlan } = useGetCurrentPricingPlan()
  const { physicalCardsPricing } = useGetPhysicalCardsPricing()

  return useMemo(() => {
    if (!currentPricingPlan || !physicalCardsPricing || !pricingPlans) {
      return null
    }

    const selectedDesignPrice = physicalCardsPricing?.find(
      (pricing) => pricing.code === designOptions.code,
    )

    if (!selectedDesignPrice) {
      Sentry.captureException(
        new Error(`there is no pricing for card ${designOptions.code}`),
      )
      return null
    }

    const isCardFree = selectedDesignPrice.price.amount === 0

    const ctaText = (
      <Trans
        t={t}
        i18nKey={getCTAKey(isCardFree)}
        values={{
          cardName: t(`common:card_name.${designOptions.code}`),
          price: formatCardPrice(
            isCardFree ? selectedDesignPrice.originalPrice : selectedDesignPrice.price,
          ),
        }}
        components={{
          strike: <StrikedPrice />,
        }}
      />
    )

    const plusPlan = pricingPlans.find(isPricingPlanPlus)
    const premiumPlan = pricingPlans.find(isPricingPlanPremium)
    const metalPlan = pricingPlans.find(isPricingPlanMetal)

    const isPlusUpgradeRequired = isPlanUpgradeRequired(currentPricingPlan, plusPlan)

    const isPremiumUpgradeRequired = isPlanUpgradeRequired(
      currentPricingPlan,
      premiumPlan,
    )

    const isMetalUpgradeRequired = isPlanUpgradeRequired(currentPricingPlan, metalPlan)

    switch (designOptions.groupName) {
      case PhysicalCardDesignGroup.Standard:
        return {
          cta: ctaText,
          buttonVariant: ButtonVariant.DEFAULT,
          footerText: getFooterText(t, false),
          requiresPlanUpgrade: false,
        }
      case PhysicalCardDesignGroup.Crypto:
      case PhysicalCardDesignGroup.Flags:
        return {
          cta: ctaText,
          buttonVariant: ButtonVariant.DEFAULT,
          footerText: getFooterText(
            t,
            isPlusUpgradeRequired,
            t('common:plans.plus.name'),
          ),
          requiresPlanUpgrade: isPlusUpgradeRequired,
        }
      case PhysicalCardDesignGroup.Plus:
        return {
          cta: ctaText,
          buttonVariant: ButtonVariant.BLACK,
          footerText: getFooterText(
            t,
            isPlusUpgradeRequired,
            t('common:plans.plus.name'),
          ),
          requiresPlanUpgrade: isPlusUpgradeRequired,
        }
      case PhysicalCardDesignGroup.Premium:
        return {
          cta: ctaText,
          buttonVariant: ButtonVariant.BLACK,
          footerText: getFooterText(
            t,
            isPremiumUpgradeRequired,
            t('common:plans.premium.name'),
          ),
          requiresPlanUpgrade: isPremiumUpgradeRequired,
        }
      case PhysicalCardDesignGroup.Metal:
        return {
          cta: ctaText,
          buttonVariant: ButtonVariant.BLACK,
          footerText: getFooterText(
            t,
            isMetalUpgradeRequired,
            t('common:plans.metal.name'),
          ),
          requiresPlanUpgrade: isMetalUpgradeRequired,
        }
      default:
        return null
    }
  }, [
    currentPricingPlan,
    designOptions.code,
    designOptions.groupName,
    physicalCardsPricing,
    pricingPlans,
    t,
  ])
}
