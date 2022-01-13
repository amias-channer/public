import {Config} from 'frontend-core/dist/models/config';
import {
    AgendaRequestParams,
    AgendaDividendItemResponse,
    AgendaDividendItem,
    AgendaSearchResult,
    AgendaTypeIds
} from '../../models/agenda';
import parseAgendaDividendItemFromResponse from './parse-agenda-dividend-item-from-response';
import getAgendaItems from './get-agenda-items';

type AgendaTopDividendItemsResponse = AgendaSearchResult<AgendaDividendItemResponse>;

export default async function getAgendaDividendsPreview(
    config: Config,
    params: AgendaRequestParams
): Promise<AgendaSearchResult<AgendaDividendItem>> {
    const response: AgendaTopDividendItemsResponse = await getAgendaItems<AgendaTopDividendItemsResponse>(
        config,
        {
            ...params,
            calendarType: AgendaTypeIds.DIVIDEND
        },
        `${config.refinitivAgendaUrl}/dividends-preview`
    );

    return {
        ...response,
        items: response.items ? response.items.map(parseAgendaDividendItemFromResponse) : []
    };
}
