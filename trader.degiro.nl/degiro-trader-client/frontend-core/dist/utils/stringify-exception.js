export default function stringifyException(event) {
    var _a;
    const proto = (_a = event.constructor) === null || _a === void 0 ? void 0 : _a.prototype;
    if (!proto) {
        // standard stringification
        return JSON.stringify(event);
    }
    const eventInfo = {};
    for (const prop in event) {
        let value = event[prop];
        if (value instanceof Node) {
            value = 'Node';
        }
        else if (value === window) {
            value = 'Window';
        }
        else if (typeof value === 'function') {
            value = 'function';
        }
        else if (typeof value === 'object') {
            // circular structure or other error is possible
            value = 'Object';
        }
        eventInfo[prop] = value;
    }
    return JSON.stringify(eventInfo);
}
//# sourceMappingURL=stringify-exception.js.map