export default function replaceItemAtIndex(array, index, newValue) {
    return [...array.slice(0, index), newValue, ...array.slice(index + 1)];
}
//# sourceMappingURL=replace-item-at-index.js.map