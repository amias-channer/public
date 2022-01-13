export default function isExchangeIdValid(exchangeId) {
    return Boolean((exchangeId || exchangeId === 0) && Number(exchangeId) !== -1);
}
//# sourceMappingURL=is-exchange-id-valid.js.map