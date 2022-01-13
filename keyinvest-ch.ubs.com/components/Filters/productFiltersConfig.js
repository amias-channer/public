import FilterDropdown from './FilterDropdown';
import FilterProductType from './FilterProductTypeDropdown';
import FilterRange from './FilterRange';
import FilterDropdownRadio from './FilterDropdownRadio';
import FilterCheckbox from './FilterCheckbox';
import FilterUnderlyingDropdown from './FilterUnderlyingsDropdown';
import FilterDropdownNested from './FilterDropdownNested';
import FilterDropdownRange from './FilterDropdownRange';
import FilterMonthsPicker from './FilterMonthsPicker';
import FilterDatesPicker from './FilterDatesPicker';
import getAppConfig from '../../main/AppConfig';
import FilterDropdownGroupedNested from './FilterDropdownGroupedNested';
import FilterFlatOneLevelNested from './FilterFlatOneLevelNested';
import FilterDropdownNonSearchable from './FilterDropdownNonSearchable';
import FilterDropdownGroupedNestedVariant from './FilterDropdownGroupedNestedVariant';

export const getProductFilterComponentByKey = (filterKey) => {
  const componentsMapping = {
    currencies: FilterDropdown,
    currency: FilterDropdown,
    maturityType: FilterDropdown,
    tag: FilterDropdownGroupedNestedVariant,
    productType: FilterProductType,
    underlyings: FilterUnderlyingDropdown,
    discountPercentStrikeCurrency: FilterRange,
    sidewaysProfitPercentPaStrikeCurrency: FilterRange,
    distance2ClosestBarrierLevelPercent: FilterRange,
    distance2BarrierLevelPercent: FilterRange,
    couponPercentPa: FilterRange,
    protectionLevelRelativePercent: FilterRange,
    participationRatePercent: FilterRange,
    maturityDate: getAppConfig().application === 'de' ? FilterDatesPicker : FilterMonthsPicker,
    instrumentType: FilterCheckbox,
    initialLeverage: FilterDropdown,
    direction: FilterCheckbox,
    tradingPlace: FilterCheckbox,
    formattedDirection: FilterCheckbox,
    leverage: FilterRange,
    delta: FilterRange,
    distance2koLevelRefCurPercent: FilterRange,
    koLevelRefCurAbsolute: FilterRange,
    omega: FilterRange,
    strategyProduct: FilterCheckbox,
    assetClass: FilterCheckbox,
    underlyingAssetClasses: FilterDropdownNested,
    quanto: FilterCheckbox,
    totalReturn: FilterCheckbox,
    sideways_return: FilterDropdownRange,
    distance2Barrier: FilterDropdownRadio,
    brcCategory: FilterDropdown,
    underlyingType: FilterDropdown,
    strike: FilterRange,
    cap: FilterRange,
    region: FilterDropdownNested,
    barrierLevelAbsoluteReferenceCurrency: FilterRange,
    bonusLevelAbsoluteReferenceCurrency: FilterRange,
    koLevelRefCurAbsoluteExtra: FilterRange,
    chartPattern: FilterDropdownGroupedNested,
    returnExpectation: FilterRange,
    timeHorizon: FilterFlatOneLevelNested,
    timeWindow: FilterDropdownNonSearchable,
    breakoutDirection: FilterFlatOneLevelNested,
    candlePattern: FilterDropdown,
    referencePriceAbsolute: FilterRange,
    lowerStrike: FilterRange,
    upperStrike: FilterRange,
  };
  return componentsMapping[filterKey];
};
