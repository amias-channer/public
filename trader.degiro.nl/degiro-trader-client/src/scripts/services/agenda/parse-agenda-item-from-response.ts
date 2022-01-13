import {AgendaItemResponse, AgendaItem, AgendaTypeIds} from '../../models/agenda';

export default function parseAgendaItemFromResponse<T extends AgendaItemResponse>(
    item: T,
    typeId: AgendaTypeIds
): AgendaItem<T> {
    return {
        ...item,
        typeId,
        dateTime: new Date(item.dateTime),
        lastUpdate: item.lastUpdate ? new Date(item.lastUpdate) : undefined
    };
}
