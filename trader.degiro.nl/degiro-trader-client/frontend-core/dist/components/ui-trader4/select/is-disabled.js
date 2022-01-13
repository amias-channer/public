export default function isDisabled(options, defaultDisabled, selectedOptions) {
    if (defaultDisabled !== undefined) {
        return defaultDisabled;
    }
    /**
     * We can disable a dropdown by options size only if it has a selected option,
     * otherwise user won't be able to select the first one
     */
    if (selectedOptions && selectedOptions.length) {
        return !options[1];
    }
    return !options[0];
}
//# sourceMappingURL=is-disabled.js.map