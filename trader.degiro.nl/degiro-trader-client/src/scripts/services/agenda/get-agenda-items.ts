import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import {AgendaRequestParams} from '../../models/agenda';

function formatDateForRequest(date: Date): string {
    // FIXME: BE should support ISO 8601 format (with milliseconds before the timezone)
    return date.toISOString().replace(/(\.[0-9]+)[Z]/, 'Z');
}

function formatStartDateForRequest(originalDate: Date): string {
    const date = new Date(originalDate);

    date.setHours(0, 0, 0, 0);
    return formatDateForRequest(date);
}

function formatEndDateForRequest(originalDate: Date): string {
    const date = new Date(originalDate);

    date.setHours(23, 59, 59, 999);
    return formatDateForRequest(date);
}

export default function getAgendaItems<T>(config: Config, params: AgendaRequestParams, url?: string): Promise<T> {
    return requestToApi({
        config,
        url: url || config.refinitivAgendaUrl,
        params: {
            ...params,
            startDate: formatStartDateForRequest(params.startDate),
            endDate: formatEndDateForRequest(params.endDate)
        }
    });
}
