const productTypesOrderMap = Object.create(null);
[
    'stock',
    'option',
    'future',
    'certificate',
    'leveraged',
    'bond',
    'fund',
    'etf',
    'cfd',
    'warrant',
    'index',
    'cash',
    'currency'
].forEach((name, index) => {
    return (productTypesOrderMap[name] = index);
});
export default function sortProductTypes(first, second) {
    const firstValue = productTypesOrderMap[first.name];
    const secondValue = productTypesOrderMap[second.name];
    if (firstValue === undefined) {
        return 1;
    }
    if (secondValue === undefined) {
        return -1;
    }
    return firstValue - secondValue;
}
//# sourceMappingURL=sort-product-types.js.map