import {AgendaItem, AgendaTypeIds, AgendaEarningItemResponse} from '../../models/agenda';
import formatLinkContent from './format-link-content';
import parseAgendaItemFromResponse from './parse-agenda-item-from-response';

export default function parseAgendaEarningsItemFromResponse<T extends AgendaEarningItemResponse>(
    item: T,
    typeId: AgendaTypeIds
): AgendaItem<T> {
    const {summary, notes, liveDialIn, replayDialIn} = item;

    return {
        ...parseAgendaItemFromResponse(item, typeId),
        summary: summary ? formatLinkContent(summary) : undefined,
        notes: notes ? formatLinkContent(notes) : undefined,
        liveDialIn: {...liveDialIn, notes: liveDialIn?.notes ? formatLinkContent(liveDialIn.notes) : undefined},
        replayDialIn: {...replayDialIn, notes: replayDialIn?.notes ? formatLinkContent(replayDialIn.notes) : undefined}
    };
}
