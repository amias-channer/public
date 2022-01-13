import {
    KeyFigures,
    keyFiguresIds,
    RatioItem,
    RatiosGroup,
    RefinitivCompanyRatios
} from '../../models/refinitiv-company-profile';
import aggregateRatios from '../refinitiv-company-ratios/aggregate-ratios';
import getRatioItemsFromRatiosGroups from '../refinitiv-company-ratios/get-ratio-items-from-ratios-groups';

export default function getKeyFiguresFromCompanyRatios(companyRatios: RefinitivCompanyRatios): KeyFigures {
    const {currentRatios, forecastData} = companyRatios;
    const ratiosGroups: RatiosGroup[] = currentRatios?.ratiosGroups || [];
    const forecastDataRatios = forecastData?.ratios || [];
    const ratioItems: RatioItem[] = getRatioItemsFromRatiosGroups([], ratiosGroups);

    return aggregateRatios([...ratioItems, ...forecastDataRatios], keyFiguresIds);
}
