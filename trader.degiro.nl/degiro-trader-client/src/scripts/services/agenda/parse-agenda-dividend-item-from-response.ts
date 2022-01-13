import {AgendaDividendItem, AgendaDividendItemResponse, AgendaTypeIds} from '../../models/agenda';

export default function parseAgendaDividendItemFromResponse(item: AgendaDividendItemResponse): AgendaDividendItem {
    const {lastUpdate, paymentDate, exDividendDate} = item;

    return {
        ...item,
        typeId: AgendaTypeIds.DIVIDEND,
        dateTime: new Date(item.dateTime),
        lastUpdate: lastUpdate ? new Date(lastUpdate) : undefined,
        exDividendDate: exDividendDate ? new Date(exDividendDate) : undefined,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined
    };
}
