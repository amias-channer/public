import requestToApi from '../../api-requester/request-to-api';
/**
 *
 * @param {Config} config
 * @param {[string, ...string[]]} isins - NON-EMPTY list of ISIN codes
 * @returns {Promise<ProductInfo[]>}
 */
export default function getStocksByIsins(config, isins) {
    return requestToApi({
        method: 'POST',
        config,
        url: `${config.productSearchUrl}v5/stocks/lookup/isins`,
        body: isins
    }).then((response) => response.products || []);
}
//# sourceMappingURL=get-stocks-by-isins.js.map