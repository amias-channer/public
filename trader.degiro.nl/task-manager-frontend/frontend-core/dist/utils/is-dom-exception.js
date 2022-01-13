export default function isDomException(value) {
    return Object.prototype.toString.call(value) === '[object DOMException]';
}
//# sourceMappingURL=is-dom-exception.js.map