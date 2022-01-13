export default function setConfigFromUser(initialConfig, { settings, accountInfo, intAccount }) {
    return {
        ...initialConfig,
        intAccount,
        baseCurrency: (accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo.baseCurrency) || initialConfig.baseCurrency,
        fractionDelimiter: (settings === null || settings === void 0 ? void 0 : settings.decimalDelimiter) || initialConfig.fractionDelimiter,
        thousandDelimiter: (settings === null || settings === void 0 ? void 0 : settings.thousandDelimiter) || initialConfig.thousandDelimiter
    };
}
//# sourceMappingURL=set-config-from-user.js.map