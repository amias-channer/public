import {Config} from 'frontend-core/dist/models/config';
import {
    AgendaRequestParams,
    AgendaEconomicItemResponse,
    AgendaEconomicItem,
    AgendaSearchResult,
    AgendaTypeIds
} from '../../models/agenda';
import parseAgendaEconomicItemFromResponse from './parse-agenda-economic-item-from-response';
import getAgendaItems from './get-agenda-items';

type AgendaEconomicItemsResponse = AgendaSearchResult<AgendaEconomicItemResponse>;

export default async function getAgendaEconomics(
    config: Config,
    params: AgendaRequestParams
): Promise<AgendaSearchResult<AgendaEconomicItem>> {
    const response = await getAgendaItems<AgendaEconomicItemsResponse>(config, {
        ...params,
        calendarType: AgendaTypeIds.ECONOMIC
    });

    return {
        ...response,
        items: response.items
            ? response.items.map((item: AgendaEconomicItemResponse) => parseAgendaEconomicItemFromResponse(item))
            : []
    };
}
