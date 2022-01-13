import {AgendaAnyTypeItem, AgendaTypeIds} from '../../models/agenda';

export default function isAgendaItemOfType<T extends AgendaAnyTypeItem>(
    item: AgendaAnyTypeItem,
    typeId: AgendaTypeIds
): item is T {
    return item.typeId === typeId;
}
