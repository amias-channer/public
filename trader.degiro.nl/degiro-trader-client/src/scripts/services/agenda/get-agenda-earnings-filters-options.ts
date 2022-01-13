import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import shiftDate from 'frontend-core/dist/utils/date/shift-date';
import startOfDay from 'frontend-core/dist/utils/date/start-of-day';
import {AgendaEarningsFiltersOptions, AgendaEarningsFiltersOptionsResponse, AgendaTypeIds} from '../../models/agenda';

export default async function getAgendaEarningsFiltersOptions(config: Config): Promise<AgendaEarningsFiltersOptions> {
    const today = startOfDay(new Date());
    const response: AgendaEarningsFiltersOptionsResponse = await requestToApi({
        config,
        url: `${config.refinitivAgendaUrl}/agenda-filters?calendarType=${AgendaTypeIds.EARNING}`
    });
    const {minDate, maxDate} = response;

    return {
        ...response,
        periodBoundaries: {
            start: minDate ? startOfDay(new Date(minDate)) : shiftDate(today, {months: -6}),
            end: maxDate ? startOfDay(new Date(maxDate)) : shiftDate(today, {months: 6})
        }
    };
}
