import { filterOptionAllId } from '../../filter/index';
export default function getProductDefaultFilterValue(currentValue, newValue) {
    const isCurrentValueEmpty = !currentValue && currentValue !== 0 && currentValue !== false;
    const isNewValueEmpty = !newValue && newValue !== 0 && newValue !== false;
    if (isCurrentValueEmpty && isNewValueEmpty) {
        return filterOptionAllId;
    }
    if (isCurrentValueEmpty) {
        return newValue;
    }
    return currentValue;
}
//# sourceMappingURL=get-product-default-filter-value.js.map