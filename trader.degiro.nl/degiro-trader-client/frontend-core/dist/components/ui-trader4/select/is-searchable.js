export default function isSearchable(options, defaultSearchable) {
    return defaultSearchable === undefined ? options.length >= 10 : defaultSearchable;
}
//# sourceMappingURL=is-searchable.js.map