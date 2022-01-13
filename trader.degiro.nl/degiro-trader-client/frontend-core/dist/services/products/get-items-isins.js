import omitNullable from '../../utils/omit-nullable';
export default function getItemsIsins(items) {
    return omitNullable(items.map((item) => item.isin));
}
//# sourceMappingURL=get-items-isins.js.map