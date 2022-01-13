import {AgendaEconomicItem, AgendaEconomicItemResponse, AgendaTypeIds} from '../../models/agenda';

export default function parseAgendaEconomicItemFromResponse(item: AgendaEconomicItemResponse): AgendaEconomicItem {
    const {lastUpdate, endDateTime} = item;

    return {
        ...item,
        typeId: AgendaTypeIds.ECONOMIC,
        actual: Number(item.actual),
        previous: Number(item.previous),
        dateTime: new Date(item.dateTime),
        lastUpdate: lastUpdate ? new Date(lastUpdate) : undefined,
        endDateTime: endDateTime ? new Date(endDateTime) : undefined,
        countryCode: item.countryCode || ''
    };
}
