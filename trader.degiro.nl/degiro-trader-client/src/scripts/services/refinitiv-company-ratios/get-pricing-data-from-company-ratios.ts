import {
    PricingData,
    pricingDataIds,
    RatioItem,
    RatiosGroup,
    RefinitivCompanyRatios
} from '../../models/refinitiv-company-profile';
import aggregateRatios from './aggregate-ratios';
import getRatioItemsFromRatiosGroups from './get-ratio-items-from-ratios-groups';

export default function getPricingDataFromCompanyRatios(companyRatios: RefinitivCompanyRatios): PricingData {
    const {sharesOut, totalFloat, currentRatios} = companyRatios;
    const ratiosGroups: RatiosGroup[] = currentRatios?.ratiosGroups || [];
    const ratioItems: RatioItem[] = getRatioItemsFromRatiosGroups([], ratiosGroups);

    return {
        sharesOut,
        totalFloat,
        currency: currentRatios?.currency,
        priceCurrency: currentRatios?.priceCurrency,
        ...aggregateRatios(ratioItems, pricingDataIds)
    };
}
