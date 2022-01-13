import parseDate from '../../utils/date/parse-date';
import requestToApi from '../api-requester/request-to-api';
function compareDocuments(documentA, documentB) {
    var _a, _b;
    return (((_a = documentB.date) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = documentA.date) === null || _b === void 0 ? void 0 : _b.getTime()) || 0);
}
export default async function getFlatexReportDocuments(config) {
    const documents = await requestToApi({
        config,
        url: `${config.paUrl}document/flatex/list`
    });
    return documents
        .map((document) => ({
        ...document,
        date: parseDate(document.date, { keepOriginDate: true })
    }))
        .sort(compareDocuments);
}
//# sourceMappingURL=get-flatex-report-documents.js.map