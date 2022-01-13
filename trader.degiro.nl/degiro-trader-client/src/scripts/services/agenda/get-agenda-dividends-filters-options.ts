import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import shiftDate from 'frontend-core/dist/utils/date/shift-date';
import startOfDay from 'frontend-core/dist/utils/date/start-of-day';
import {AgendaDividendsFiltersOptions, AgendaDividendsFiltersOptionsResponse, AgendaTypeIds} from '../../models/agenda';

export default async function getAgendaDividendsFiltersOptions(config: Config): Promise<AgendaDividendsFiltersOptions> {
    const today = startOfDay(new Date());
    const response: AgendaDividendsFiltersOptionsResponse = await requestToApi({
        config,
        url: `${config.refinitivAgendaUrl}/agenda-filters?calendarType=${AgendaTypeIds.DIVIDEND}`
    });
    const {minDate, maxDate, fromDividend, toDividend, fromYield, toYield} = response;

    return {
        ...response,
        periodBoundaries: {
            start: minDate ? startOfDay(new Date(minDate)) : shiftDate(today, {months: -6}),
            end: maxDate ? startOfDay(new Date(maxDate)) : shiftDate(today, {months: 6})
        },
        dividendInterval: {
            start: fromDividend,
            end: toDividend
        },
        yieldInterval: {
            start: fromYield,
            end: toYield
        }
    };
}
