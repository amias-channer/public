import { noneValueId } from '../../models/dictionary';
export default function setNoneValueTranslationByFilterKey(filterKey, translation) {
    return (aggregateValues) => {
        const optionsList = aggregateValues[filterKey];
        if (!Array.isArray(optionsList)) {
            return aggregateValues;
        }
        const noneItemIndex = optionsList.findIndex(({ id }) => id === noneValueId);
        if (noneItemIndex >= 0) {
            return {
                ...aggregateValues,
                [filterKey]: [
                    ...optionsList.slice(0, noneItemIndex),
                    { ...optionsList[noneItemIndex], translation },
                    ...optionsList.slice(noneItemIndex + 1)
                ]
            };
        }
        return aggregateValues;
    };
}
//# sourceMappingURL=set-none-value-translation-by-filter-key.js.map