const filterNameTranslations = {
    issuer: 'trader.filtersList.issuer',
    issuerType: 'trader.productsSearch.issuerType',
    feeType: 'trader.filtersList.feeType',
    country: 'trader.forms.country',
    stockList: 'trader.filtersList.stockList',
    shortLong: 'trader.filtersList.shortLong',
    exchange: 'trader.filtersList.exchange',
    strikeType: 'trader.filtersList.strikeType',
    underlying: 'trader.filtersList.underlying',
    month: 'trader.filtersList.monthFilter',
    year: 'trader.filtersList.yearFilter',
    region: 'trader.filtersList.regionFilter'
};
export default function getProductFilterNameTranslation(filterId) {
    return filterNameTranslations[filterId];
}
//# sourceMappingURL=get-product-filter-name-translation.js.map