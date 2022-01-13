import requestToApi from '../api-requester/request-to-api';
export default async function getReportDocuments(config) {
    const { paUrl } = config;
    const documents = await requestToApi({
        config,
        url: `${paUrl}document/list/report`
    });
    // TODO: remove and set a correct order on BE (from the newest to oldest)
    return documents.reverse();
}
//# sourceMappingURL=get-report-documents.js.map