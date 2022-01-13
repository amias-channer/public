import getMarketIndices from '../market-index/get-market-indices';
export default function getMarketMoversIndices(config, client) {
    const { settings } = client;
    const ids = settings && settings.marketMoversIndexIds;
    if (!ids) {
        return Promise.reject(new Error('Market movers indices not found'));
    }
    return getMarketIndices(config, client).then((marketIndices) => {
        return marketIndices.filter((marketIndex) => ids.indexOf(marketIndex.id) >= 0);
    });
}
//# sourceMappingURL=get-market-movers-indices.js.map