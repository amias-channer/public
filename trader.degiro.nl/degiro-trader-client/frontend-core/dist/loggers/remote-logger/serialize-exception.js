import isFunction from '../../utils/is-function';
function serializeValue(value, depth = 3) {
    if (Array.isArray(value)) {
        return value.map((subValue) => serializeValue(subValue, depth - 1));
    }
    if (isFunction(value)) {
        return Object.prototype.toString.call(value);
    }
    if (typeof value === 'object' && value !== null) {
        if (depth) {
            return Object.entries(value).reduce((info, [prop, subValue]) => {
                info[prop] = serializeValue(subValue, depth - 1);
                return info;
            }, {});
        }
        return Object.prototype.toString.call(value);
    }
    return value;
}
export default function serializeException(exception) {
    return serializeValue(exception);
}
//# sourceMappingURL=serialize-exception.js.map