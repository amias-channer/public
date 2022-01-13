import getQueryString from '../../utils/url/get-query-string';
export default function getFlatexDocumentUrl(config, documentId) {
    return `${config.paUrl}document/flatex/download/${documentId}?${getQueryString({
        sessionId: config.sessionId,
        intAccount: config.intAccount
    })}`;
}
//# sourceMappingURL=get-flatex-document-url.js.map