import getFilterOptionAll from '../../filter/get-filter-option-all';
import getFilterOptionById from '../product/get-filter-option-by-id';
import getFundFeeTypes from './get-fund-fee-types';
import getFundIssuers from './get-fund-issuers';
export default async function getFundsFiltersOptions(config, client, i18n, filters) {
    var _a;
    const feeTypes = await getFundFeeTypes(config, client);
    const feeTypeId = (_a = getFilterOptionById(filters.feeType, feeTypes)) === null || _a === void 0 ? void 0 : _a.id;
    const issuers = await getFundIssuers(config, {
        investmentFundFeeTypeId: feeTypeId === undefined ? undefined : Number(feeTypeId)
    });
    return {
        issuer: [getFilterOptionAll(i18n), ...issuers],
        feeType: [getFilterOptionAll(i18n), ...feeTypes]
    };
}
//# sourceMappingURL=get-funds-filters-options.js.map