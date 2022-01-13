import isAppError from '../../services/app-error/is-app-error';
import { unknownFunction } from './index';
// Chromium based browsers: Chrome, Brave, new Opera, new Edge
// eslint-disable-next-line max-len
const chrome = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
// match Blob URLs like `blob:http://url/path/with-some-uuid`, matched by `blob.*?:\/` as well
// eslint-disable-next-line max-len
const gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code]|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
// Used to additionally parse URL/line/column from eval frames
const geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
const chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/;
const getErrorBasicData = (error) => ({
    name: error.name,
    // For AppError collect all props in message to have more clear logs in Sentry.
    // E.g. its `text` prop can be empty, but `httpStatus` or `code` have important info
    message: isAppError(error) ? JSON.stringify(error) : error.message
});
const getChromeStackFrame = (stackLine) => {
    // eslint-disable-next-line prefer-const
    let [, functionName, urlInfo, lineno, colno] = chrome.exec(stackLine) || [];
    if (urlInfo) {
        const isNative = urlInfo.indexOf('native') === 0;
        const isEval = urlInfo.indexOf('eval') === 0;
        const evalSubParts = isEval ? chromeEval.exec(urlInfo) : null;
        if (evalSubParts) {
            // throw out eval line/column and use top-most line/column number
            urlInfo = evalSubParts[1];
            lineno = evalSubParts[2];
            colno = evalSubParts[3];
        }
        return {
            filename: isNative ? undefined : urlInfo,
            function: functionName,
            lineno: lineno ? Number(lineno) : undefined,
            colno: colno ? Number(colno) : undefined
        };
    }
};
const getGeckoStackFrame = (stackLine, stackLineIndex, error) => {
    // eslint-disable-next-line prefer-const
    let [, functionName, , urlInfo, lineno, colno] = gecko.exec(stackLine) || [];
    // `columnNumber` is a FF-specific property (0-based)
    const { columnNumber } = error;
    if (urlInfo) {
        const isEval = urlInfo.indexOf(' > eval') > -1;
        const evalSubParts = isEval ? geckoEval.exec(urlInfo) : null;
        if (evalSubParts) {
            // throw out eval line/column and use top-most line number
            urlInfo = evalSubParts[1];
            lineno = evalSubParts[2];
            colno = ''; // no column in FF eval
        }
        else if (stackLineIndex === 0 && !colno && typeof columnNumber === 'number') {
            // `columnNumber` is a FF-specific property (0-based)
            colno = String(columnNumber + 1);
        }
        return {
            filename: urlInfo,
            function: functionName,
            lineno: lineno ? Number(lineno) : undefined,
            colno: colno ? Number(colno) : undefined
        };
    }
};
export default function computeStackTrace(error) {
    var _a;
    const stackInfoUrl = location.href;
    const frames = [];
    const stackTraceLimit = 50;
    (((_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n')) || []).some((stackLine, stackLineIndex) => {
        if (frames[stackTraceLimit - 1]) {
            return true;
        }
        const stackFrame = getChromeStackFrame(stackLine) || getGeckoStackFrame(stackLine, stackLineIndex, error);
        if (stackFrame) {
            frames.push({
                ...stackFrame,
                // eslint-disable-next-line camelcase
                in_app: true,
                filename: stackFrame.filename || stackInfoUrl,
                function: stackFrame.function || unknownFunction
            });
        }
    });
    return {
        ...getErrorBasicData(error),
        url: stackInfoUrl,
        frames: frames[0] ? frames : undefined
    };
}
//# sourceMappingURL=compute-stack-trace.js.map