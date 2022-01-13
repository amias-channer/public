export default function sliceProductsFromSearch(products, offset, limit) {
    // [WF-998]: server may return all data in response (check MIN_AMOUNT_FOR_PAGING on backend)
    if (offset !== undefined && limit !== undefined && products.length > limit) {
        return products.slice(offset, offset + limit);
    }
    return products;
}
//# sourceMappingURL=slice-products-from-search.js.map