import {Config} from 'frontend-core/dist/models/config';
import {
    AgendaEarningsRequestParams,
    AgendaEarningItemResponse,
    AgendaEarningItem,
    AgendaSearchResult,
    AgendaTypeIds
} from '../../models/agenda';
import getAgendaItems from './get-agenda-items';
import parseAgendaEarningsItemFromResponse from './parse-agenda-earnings-item-from-response';

type AgendaEarningItemsResponse = AgendaSearchResult<AgendaEarningItemResponse>;

export default function getAgendaEarnings(
    config: Config,
    params: AgendaEarningsRequestParams
): Promise<AgendaSearchResult<AgendaEarningItem>> {
    return getAgendaItems<AgendaEarningItemsResponse>(config, {
        ...params,
        calendarType: AgendaTypeIds.EARNING
    }).then((response: AgendaEarningItemsResponse) => ({
        ...response,
        items: response.items
            ? response.items.map((item: AgendaEarningItemResponse) => {
                  return parseAgendaEarningsItemFromResponse<AgendaEarningItemResponse>(item, AgendaTypeIds.EARNING);
              })
            : []
    }));
}
