export default function getSelectOptionValue({ value }) {
    if (value) {
        const optionValueAsMap = value;
        if (optionValueAsMap.value != null) {
            return optionValueAsMap.value;
        }
        if (optionValueAsMap.id != null) {
            return optionValueAsMap.id;
        }
    }
    return value;
}
//# sourceMappingURL=get-select-option-value.js.map