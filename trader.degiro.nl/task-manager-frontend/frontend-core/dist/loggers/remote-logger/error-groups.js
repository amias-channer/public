const vwdChartErrorPattern = /TEMPLATE_NOT_LOADED|isSVG|hchart/i;
const cordovaErrorPattern = /cordova/i;
const unknownObjectErrorPattern = /\[object Object\]/i;
const sourceParserErrorPattern = /Unexpected token/i;
const unhandledRejectionPattern = /unhandledrejection/i;
const statusErrorPattern = /status["'\s:]+([-0-9]+)/i;
const webpackChunkLoadingErrorPattern = /loading chunk ([0-9]+) failed/i;
const memoryLeakErrorPattern = new RegExp([
    'out of memory',
    'onvoldoende geheugen',
    'ist nicht genügend speicher verfügbar',
    'Mémoire insuffisante',
    'Nicht genügend Arbeitsspeicher',
    'Nedostatek paměti',
    'Muisti ei riitä'
].join('|'), 'i');
export function getExceptionFingerprintFromMessage(message) {
    if (!message) {
        return;
    }
    if (cordovaErrorPattern.test(message)) {
        return ['CORDOVA'];
    }
    if (memoryLeakErrorPattern.test(message)) {
        return ['MEMORY_LEAK'];
    }
    if (sourceParserErrorPattern.test(message)) {
        return ['SOURCE_PARSER'];
    }
    if (unknownObjectErrorPattern.test(message)) {
        return ['UNKNOWN_OBJECT_ERROR'];
    }
    if (vwdChartErrorPattern.test(message)) {
        return ['VWD_CHARTS'];
    }
    if (unhandledRejectionPattern.test(message)) {
        return ['UNHANDLED_REJECTION'];
    }
    if (webpackChunkLoadingErrorPattern.test(message)) {
        return ['WEBPACK_CHUNK_LOADING'];
    }
    const statusErrorData = statusErrorPattern.exec(message);
    if (statusErrorData) {
        return [`STATUS_${statusErrorData[1]}`];
    }
}
//# sourceMappingURL=error-groups.js.map