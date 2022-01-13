import getExchanges from './get-exchanges';
export default function getExchange(config, client, options) {
    /**
     * @description Server sends strings and numbers together as exchange IDs
     * @type {string}
     */
    const exchangeId = String(options.id);
    return getExchanges(config, client).then((exchanges) => {
        const exchange = exchanges.find((exchange) => {
            return String(exchange.id) === exchangeId;
        });
        if (!exchange) {
            throw new Error('Exchange not found');
        }
        return exchange;
    });
}
//# sourceMappingURL=get-exchange.js.map