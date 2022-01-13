import {Config} from 'frontend-core/dist/models/config';
import {
    AgendaDividendRequestParams,
    AgendaDividendItemResponse,
    AgendaDividendItem,
    AgendaSearchResult,
    AgendaTypeIds
} from '../../models/agenda';
import parseAgendaDividendItemFromResponse from './parse-agenda-dividend-item-from-response';
import getAgendaItems from './get-agenda-items';

type AgendaDividendItemsResponse = AgendaSearchResult<AgendaDividendItemResponse>;

export default function getAgendaDividends(
    config: Config,
    params: AgendaDividendRequestParams
): Promise<AgendaSearchResult<AgendaDividendItem>> {
    return getAgendaItems<AgendaDividendItemsResponse>(config, {
        ...params,
        calendarType: AgendaTypeIds.DIVIDEND
    }).then((response: AgendaDividendItemsResponse) => ({
        ...response,
        items: response.items ? response.items.map(parseAgendaDividendItemFromResponse) : []
    }));
}
