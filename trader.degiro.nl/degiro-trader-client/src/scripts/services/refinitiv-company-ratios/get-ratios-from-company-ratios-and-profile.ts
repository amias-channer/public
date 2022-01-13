import {
    CompanyRatios,
    companyRatiosIds,
    RatioItem,
    RatiosGroup,
    RefinitivCompanyProfile,
    RefinitivCompanyRatios
} from '../../models/refinitiv-company-profile';
import aggregateRatios from './aggregate-ratios';
import getRatioItemsFromRatiosGroups from './get-ratio-items-from-ratios-groups';

export default function getRatiosFromCompanyRatiosAndProfile(
    companyRatios: RefinitivCompanyRatios,
    companyProfile: RefinitivCompanyProfile
): CompanyRatios {
    const {currentRatios} = companyRatios;
    const companyRatiosRatiosGroups = currentRatios?.ratiosGroups || [];
    const companyProfileRatiosGroups: RatiosGroup[] = companyProfile.ratios?.ratiosGroups || [];
    const forecastRatios: RatioItem[] = companyRatios.forecastData?.ratios || [];
    const ratioItems: RatioItem[] = [
        ...forecastRatios,
        ...getRatioItemsFromRatiosGroups(companyProfileRatiosGroups),
        ...getRatioItemsFromRatiosGroups(companyRatiosRatiosGroups)
    ];

    return aggregateRatios(ratioItems, companyRatiosIds);
}
