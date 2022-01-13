import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import * as Icons from '@revolut/icons'
import * as Sentry from '@sentry/react'

import {
  PricingPlanDto,
  PricingPlanFeature,
  PricingPlanFeatureInfo,
} from '@revolut/rwa-core-types'

import { I18_NAMESPACE } from '../../constants'
import { formatMoneyWithNoDecimal } from '../../helpers'
import { useGetInsuranceCoverCurrency } from '../useGetInsuranceCoverCurrency'
import { INSURANCE_LIMITS } from './constants'
import { FeatureResources } from './types'
import { useCreateGetterForPurchaseProtectionUpgradedFeatureResources } from './useCreateGetterForPurchaseProtectionUpgradedFeatureResources'
import { useGetCashbackFeatureDescription } from './useGetCashbackFeatureDescription'
import { useGetCommoditiesFeatureDescription } from './useGetCommoditiesFeatureDescription'
import { useGetCryptoFeatureDescription } from './useGetCryptoFeatureDescription'
import { useGetDepositsFeatureResources } from './useGetDepositsFeatureResources'
import { useGetDiscountDeviceInsuranceFeatureDescription } from './useGetDiscountDeviceInsuranceFeatureDescription'
import { useGetFreeAtmFeatureResources } from './useGetFreeAtmFeatureResources'
import { useGetFreeCrossBorderTransfersFeatureResources } from './useGetFreeCrossBorderTransfersFeatureResources'
import { useGetFreeInsuranceFeatureDescription } from './useGetFreeInsuranceFeatureDescription'
import { useGetFreePlasticCardFeatureResources } from './useGetFreePlasticCardFeatureResources'
import { useGetGlobalMoneyTransfersFeatureDescription } from './useGetGlobalMoneyTransfersFeatureDescription'
import { useGetInterbankExchangeRateFeatureResources } from './useGetInterbankExchangeRateFeatureResources'
import { useGetJuniorWalletsFeatureResources } from './useGetJuniorWalletsFeatureResources'
import { useGetSmartDelayFeatureResources } from './useGetSmartDelayFeatureResources'
import { useGetStocksFeatureDescription } from './useGetStocksFeatureDescription'
import { getFeatureDescriptionKey, getFeatureTitleKey } from './utils'

export const useGetFeatureResources = (pricingPlan: PricingPlanDto) => {
  const { t } = useTranslation(I18_NAMESPACE)
  const insuranceCoverCurrency = useGetInsuranceCoverCurrency()
  const cryptoFeatureDescription = useGetCryptoFeatureDescription(pricingPlan)
  const commodityFeatureDescription = useGetCommoditiesFeatureDescription(pricingPlan)
  const cashbackFeatureDescription = useGetCashbackFeatureDescription(pricingPlan)
  const smartDelayFeatureResources = useGetSmartDelayFeatureResources(pricingPlan)
  const freeAtmFeatureResources = useGetFreeAtmFeatureResources(pricingPlan)
  const stocksFeatureDescription = useGetStocksFeatureDescription(pricingPlan)
  const juniorWalletsFeatureResources = useGetJuniorWalletsFeatureResources(pricingPlan)
  const depositsFeatureResources = useGetDepositsFeatureResources(pricingPlan)
  const freeInsuranceFeatureDescription =
    useGetFreeInsuranceFeatureDescription(pricingPlan)
  const getPurchaseProtectionUpgradedFeatureResources =
    useCreateGetterForPurchaseProtectionUpgradedFeatureResources()
  const discountDeviceInsuranceFeatureDescription =
    useGetDiscountDeviceInsuranceFeatureDescription(pricingPlan)
  const globalMoneyTransfersFeatureDescription =
    useGetGlobalMoneyTransfersFeatureDescription(pricingPlan)
  const freePlasticCardFeatureResources =
    useGetFreePlasticCardFeatureResources(pricingPlan)
  const interbankExchangeRateFeatureResources =
    useGetInterbankExchangeRateFeatureResources(pricingPlan)
  const freeCrossBorderTransfersFeatureResources =
    useGetFreeCrossBorderTransfersFeatureResources(pricingPlan)

  return useCallback(
    (feature: PricingPlanFeatureInfo): FeatureResources => {
      switch (feature.name) {
        case PricingPlanFeature.UnlimitedFx:
          return {
            id: feature.name,
            icon: Icons.ArrowExchange,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.FreeDelayedFlightInsurance:
          return {
            id: feature.name,
            icon: Icons.Travel,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.FreeDelayedBaggageInsurance:
          return {
            id: feature.name,
            icon: Icons.Services,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.Crypto:
          return {
            id: feature.name,
            icon: Icons.Bitcoin,
            title: t(getFeatureTitleKey(feature.name)),
            description: cryptoFeatureDescription,
            isLoading: !cryptoFeatureDescription,
          }
        case PricingPlanFeature.DisposableVirtualCard:
          return {
            id: feature.name,
            icon: Icons.Cloud,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.FreeExpressDelivery:
          return {
            id: feature.name,
            icon: Icons.Lightning,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.FreeStandardDelivery:
          return {
            id: feature.name,
            icon: Icons.Lightning,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.RoundclockSupport:
          return {
            id: feature.name,
            icon: Icons.Chat,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.AirportLounges:
          return {
            id: feature.name,
            icon: Icons.Lounges,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.Gold:
          return {
            id: feature.name,
            icon: Icons.Commodities,
            title: t(getFeatureTitleKey(feature.name)),
            description: commodityFeatureDescription,
            isLoading: !commodityFeatureDescription,
          }
        case PricingPlanFeature.Gifting:
          return {
            id: feature.name,
            icon: Icons.Gift,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.PersonalisedCard:
          return {
            id: feature.name,
            icon: Icons.Card,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.PersonalisedPremiumCard:
          return {
            id: feature.name,
            icon: Icons.Card,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.PersonalisedMetalCard:
          return {
            id: feature.name,
            icon: Icons.Card,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.RefundProtection:
          return {
            id: feature.name,
            icon: Icons.RevertLeft,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name), {
              refundAmount: formatMoneyWithNoDecimal(
                INSURANCE_LIMITS.refundProtection.amount,
                insuranceCoverCurrency,
              ),
            }),
            isLoading: false,
          }
        case PricingPlanFeature.TicketCancellation:
          return {
            id: feature.name,
            icon: Icons.Reverted,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name), {
              refundAmount: formatMoneyWithNoDecimal(
                INSURANCE_LIMITS.ticketCancellation.amount,
                insuranceCoverCurrency,
              ),
            }),
            isLoading: false,
          }
        case PricingPlanFeature.Cashback:
          return {
            id: feature.name,
            icon: Icons.Cashback,
            title: t(getFeatureTitleKey(feature.name)),
            description: cashbackFeatureDescription,
            isLoading: false,
          }
        case PricingPlanFeature.SmartDelay:
          return smartDelayFeatureResources
        case PricingPlanFeature.FreeAtm:
          return freeAtmFeatureResources
        case PricingPlanFeature.Stocks:
          return {
            id: feature.name,
            icon: Icons.Wealth,
            title: t(getFeatureTitleKey(feature.name)),
            description: stocksFeatureDescription,
            isLoading: !stocksFeatureDescription,
          }
        case PricingPlanFeature.YouthWallets:
          return juniorWalletsFeatureResources
        case PricingPlanFeature.Deposits:
          return depositsFeatureResources
        case PricingPlanFeature.FreeInsurance:
          return {
            id: feature.name,
            icon: Icons.MedicalCross,
            title: t(getFeatureTitleKey(feature.name)),
            description: freeInsuranceFeatureDescription,
            isLoading: !freeInsuranceFeatureDescription,
          }
        case PricingPlanFeature.WinterSportsCover:
          return {
            id: feature.name,
            icon: Icons.Snowflake,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name), {
              insuranceAmount: formatMoneyWithNoDecimal(
                INSURANCE_LIMITS.winterSportsCover.amount,
                insuranceCoverCurrency,
              ),
            }),
            isLoading: false,
          }
        case PricingPlanFeature.CarHireExcess:
          return {
            id: feature.name,
            icon: Icons.DrivingLicence,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name), {
              daysAmount: INSURANCE_LIMITS.carHireExcess.days,
            }),
            isLoading: false,
          }
        case PricingPlanFeature.PurchaseProtection:
          return {
            id: feature.name,
            icon: Icons.Shopping,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(`${getFeatureDescriptionKey(feature.name)}.default`),
            isLoading: false,
          }
        case PricingPlanFeature.PurchaseProtectionVariant1: // Purchase protection for plus
        case PricingPlanFeature.PurchaseProtectionVariant2: // Purchase protection for premium
        case PricingPlanFeature.PurchaseProtectionVariant3: // Purchase protection for metal
          return getPurchaseProtectionUpgradedFeatureResources(feature.name)
        case PricingPlanFeature.PersonalLiability:
          return {
            id: feature.name,
            icon: Icons.Profile,
            title: t(getFeatureTitleKey(feature.name)),
            description: t(getFeatureDescriptionKey(feature.name)),
            isLoading: false,
          }
        case PricingPlanFeature.DiscountDeviceInsurance:
          return {
            id: feature.name,
            icon: Icons.SmartphoneShield,
            title: t(getFeatureTitleKey(feature.name)),
            description: discountDeviceInsuranceFeatureDescription,
            isLoading: false,
          }
        case PricingPlanFeature.GlobalMoneyTransfers:
          return {
            id: feature.name,
            icon: Icons.ArrowsPayments,
            title: t(getFeatureTitleKey(feature.name)),
            description: globalMoneyTransfersFeatureDescription,
            isLoading: false,
          }
        case PricingPlanFeature.FreePlasticCard:
          return freePlasticCardFeatureResources
        case PricingPlanFeature.FreeFx:
          return interbankExchangeRateFeatureResources
        case PricingPlanFeature.FreeCrossBorderTransfers:
          return freeCrossBorderTransfersFeatureResources
        case PricingPlanFeature.UnlimitedCrossBorderTransfers:
        case PricingPlanFeature.BrandedGifting:
        case PricingPlanFeature.FamilyCover:
          return null // for features which don't need to be on the list (outdated or unavailable)
        default:
          Sentry.captureException(
            new Error(`feature: ${feature.name} was not implemented`),
          )
          return null
      }
    },
    [
      cashbackFeatureDescription,
      commodityFeatureDescription,
      cryptoFeatureDescription,
      depositsFeatureResources,
      discountDeviceInsuranceFeatureDescription,
      freeAtmFeatureResources,
      freeCrossBorderTransfersFeatureResources,
      freeInsuranceFeatureDescription,
      freePlasticCardFeatureResources,
      getPurchaseProtectionUpgradedFeatureResources,
      globalMoneyTransfersFeatureDescription,
      insuranceCoverCurrency,
      interbankExchangeRateFeatureResources,
      juniorWalletsFeatureResources,
      smartDelayFeatureResources,
      stocksFeatureDescription,
      t,
    ],
  )
}
