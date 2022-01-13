/*
 this one not coming from BE now
 limits taken from https://bitbucket.org/revolut/revolut-android/src/development/app_retail/feature_insurance_api/src/main/java/com/revolut/feature/insurance/api/InsuranceLimits.kt)
 */
export const INSURANCE_LIMITS = {
  carHireExcess: {
    amount: 2_000_00,
    days: 31,
  },
  deviceInsurance: {
    discountPercentage: 20,
  },
  purchaseProtectionPlus: {
    amount: 1_000_00,
    days: 365,
  },
  purchaseProtectionPremium: {
    amount: 2500_00,
    days: 365,
  },
  purchaseProtectionMetal: {
    amount: 10_000_00,
    days: 365,
  },
  refundProtection: {
    amount: 300_00, // taken from android source code (https://bitbucket.org/revolut/revolut-android/src/a468e1baf69033d4563abb87fb79dbf36854c1e6/app_retail/feature_pricing_plans_impl/src/main/java/com/revolut/feature/pricingplans/impl/ui/plandashboard/list/PlanFeatureListResourceFactory.kt#lines-743)
  },
  ticketCancellation: {
    amount: 1_000_00, // taken from android source code (https://bitbucket.org/revolut/revolut-android/src/a468e1baf69033d4563abb87fb79dbf36854c1e6/app_retail/feature_pricing_plans_impl/src/main/java/com/revolut/feature/pricingplans/impl/ui/plandashboard/list/PlanFeatureListResourceFactory.kt#lines-770)
  },
  travelInsurance: {
    amount: 10_000_000_00, // taken from android source code (https://bitbucket.org/revolut/revolut-android/src/a468e1baf69033d4563abb87fb79dbf36854c1e6/app_retail/feature_pricing_plans_impl/src/main/java/com/revolut/feature/pricingplans/impl/ui/mapper/PricingPlanStringMapperImpl.kt#lines-150)
  },
  winterSportsCover: {
    amount: 10_000_000_00,
  },
}
