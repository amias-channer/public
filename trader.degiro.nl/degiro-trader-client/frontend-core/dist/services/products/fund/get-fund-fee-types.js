import getDictionary from '../../dictionary/get-dictionary';
export default async function getFundFeeTypes(config, { language }) {
    const { investmentFundFeeTypes } = await getDictionary(config);
    const feeTypes = investmentFundFeeTypes.filter((investmentFundFeeType) => {
        // [WEB-2162]
        // "Rebate-free Free of charge" option should be visible only for Dutch customers (+ Belgian (NL))
        return investmentFundFeeType.id !== 3 || language === 'nl';
    });
    return feeTypes;
}
//# sourceMappingURL=get-fund-fee-types.js.map