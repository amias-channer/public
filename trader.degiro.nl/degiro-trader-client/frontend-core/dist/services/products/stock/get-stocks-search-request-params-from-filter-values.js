import isFilterOptionAll from '../../filter/is-filter-option-all';
/**
 * @important: Tricky case!
 *
 * For stocks search result we show all stocks and one product on top of this.
 * That product correspond for market index and appear only in some cases
 *
 * for example:
 *      country = Belgium, indices = BEL 20 we need to load one more product with id = 4824939
 *
 * In this case we need to do 2 requests:
 *      getStocks (..., params: StocksRequestParams)
 *      getProductInfo(..., {id: marketIndexProductId}
 *
 * @param {StocksFilters} filters
 * @returns {StocksSearchRequestParams}
 */
export default function getStocksSearchRequestParamsFromFilterValues(filters) {
    const { country, stockList, stockListType, searchText, isInUSGreenList, marketIndexProductId } = filters;
    return {
        isInUSGreenList: isInUSGreenList || undefined,
        [stockListType === 'index' ? 'indexId' : 'exchangeId']: stockList,
        stockCountryId: !country || isFilterOptionAll(country) ? undefined : Number(country),
        searchText,
        marketIndexProductId
    };
}
//# sourceMappingURL=get-stocks-search-request-params-from-filter-values.js.map