import shiftDate from 'frontend-core/dist/utils/date/shift-date';
import {RefinitivCompanyRatios} from '../../models/refinitiv-company-profile';

export default function areCompanyRatiosUpToDate(companyRatios?: RefinitivCompanyRatios): boolean {
    const {forecastData, lastModified} = companyRatios || {};

    if (!forecastData || !lastModified) {
        return false;
    }

    const {endMonth, fiscalYear, interimEndCalMonth, interimEndCalYear} = forecastData;
    const lastYear: number = new Date().getFullYear() - 1;
    const firstJulyLastYear: Date = new Date(lastYear, 6, 1);

    return [
        new Date(lastModified),
        shiftDate(new Date(Number(fiscalYear), Number(endMonth)), {days: -1}),
        shiftDate(new Date(Number(interimEndCalYear), Number(interimEndCalMonth)), {days: -1})
    ].every((date: Date) => date > firstJulyLastYear);
}
