import getQueryString from '../../utils/url/get-query-string';
export default function getDocumentUrl(config, documentId) {
    return `${config.paUrl}document/download/${documentId}?${getQueryString({
        sessionId: config.sessionId,
        intAccount: config.intAccount
    })}`;
}
//# sourceMappingURL=get-document-url.js.map