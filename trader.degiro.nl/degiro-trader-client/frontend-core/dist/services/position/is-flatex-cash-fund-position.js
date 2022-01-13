import getPrimaryCashFunds from '../cash-fund/get-primary-cash-funds';
import isJointCashPosition from './is-joint-cash-position';
export default function isFlatexCashFundPosition(currentClient, position) {
    if (!isJointCashPosition(position)) {
        return false;
    }
    const cashFundsByCurrency = getPrimaryCashFunds(currentClient, position.productInfo.currency) || [];
    return cashFundsByCurrency.some((userCashFund) => userCashFund.isFlatex);
}
//# sourceMappingURL=is-flatex-cash-fund-position.js.map