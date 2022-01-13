import { cashFundInfoDefaultPositionFields } from '../../models/cash-fund';
import isJointCashPosition from '../position/is-joint-cash-position';
import hasFlatexBankAccount from '../user/has-flatex-bank-account';
export default function getCashFundInfoFromPortfolio(config, currentClient, position, totalPortfolio) {
    const baseCashFundInfo = {
        freeCash: totalPortfolio.degiroCash,
        totalLiquidity: totalPortfolio.totalCash,
        // BE sends 0 in `flatexCash` even when client doesn't have Flatex account
        totalFlatexFundValue: hasFlatexBankAccount(currentClient) ? totalPortfolio.flatexCash : undefined
    };
    if (!isJointCashPosition(position)) {
        return baseCashFundInfo;
    }
    const { productInfo } = position;
    const positionCashFundInfo = cashFundInfoDefaultPositionFields.reduce((cashFundInfo, field) => {
        cashFundInfo[field] = position[field];
        return cashFundInfo;
    }, {});
    // for base currency position we should override some position values with the ones from total portfolio
    if ((productInfo === null || productInfo === void 0 ? void 0 : productInfo.currency) === config.baseCurrency) {
        return { productInfo, ...positionCashFundInfo, ...baseCashFundInfo };
    }
    // [TRADER-758] for other currency positions we should not use total portfolio values
    return { productInfo, ...positionCashFundInfo };
}
//# sourceMappingURL=get-cash-fund-info-from-portfolio.js.map