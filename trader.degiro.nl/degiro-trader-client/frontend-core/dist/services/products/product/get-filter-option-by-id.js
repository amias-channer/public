// TODO: Rename findFilterOptionById and change signature
//  findFilterOptionById <T extends FiltersOptions> (
//         id: number | string,
//         options: T[]
//  )
export default function getFilterOptionById(id, options) {
    if (!options) {
        return;
    }
    const firstItem = options[0];
    if (id == null) {
        return firstItem;
    }
    const itemValue = String(id);
    return options.find((item) => String(item.id) === itemValue) || firstItem;
}
//# sourceMappingURL=get-filter-option-by-id.js.map