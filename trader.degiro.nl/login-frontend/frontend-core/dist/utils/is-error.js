const objToString = Object.prototype.toString;
export default function isError(value) {
    return (objToString.call(value) === '[object Error]' ||
        value instanceof Error ||
        (value && typeof value.message === 'string' && typeof value.name === 'string'));
}
//# sourceMappingURL=is-error.js.map