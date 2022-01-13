import localize from '../../services/i18n/localize';
export default function getFavouriteProductsListName(i18n, list) {
    return list.isDefault ? localize(i18n, 'trader.productActions.watchlist.names.default') : list.name;
}
//# sourceMappingURL=get-favourite-products-list-name.js.map