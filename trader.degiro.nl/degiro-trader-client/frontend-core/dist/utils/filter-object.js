export default function filterObject(obj, predicate) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => predicate(value)));
}
//# sourceMappingURL=filter-object.js.map