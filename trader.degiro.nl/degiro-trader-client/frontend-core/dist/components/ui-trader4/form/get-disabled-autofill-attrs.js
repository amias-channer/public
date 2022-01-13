import getAutocompleteAttrValue from '../../ui-common/form/get-autocomplete-attr-value';
export default function getDisabledAutofillAttrs(fieldName) {
    return {
        autoComplete: getAutocompleteAttrValue(fieldName),
        // [WF-2620] disable LastPass autofill
        'data-lpignore': 'true'
    };
}
//# sourceMappingURL=get-disabled-autofill-attrs.js.map