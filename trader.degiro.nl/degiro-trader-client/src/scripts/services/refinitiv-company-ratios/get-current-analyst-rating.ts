import {OpinionPeriodTypes, PeriodItem, RefinitivCompanyRatios} from '../../models/refinitiv-company-profile';

export default function getCurrentAnalystRating(companyRatios: RefinitivCompanyRatios): number | undefined {
    const currentPeriod: PeriodItem | undefined = companyRatios.consRecommendationTrend?.ratings?.find(
        (rating) => rating.periodType === OpinionPeriodTypes.CURR
    );

    return currentPeriod?.value;
}
