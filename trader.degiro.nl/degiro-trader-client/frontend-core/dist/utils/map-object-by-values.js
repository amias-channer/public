export default function mapObjectByValues(obj, mapFn) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, mapFn(value)]));
}
//# sourceMappingURL=map-object-by-values.js.map