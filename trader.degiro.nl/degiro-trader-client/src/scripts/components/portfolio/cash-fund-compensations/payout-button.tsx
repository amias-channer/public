import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {BankBookingSourceIds, CashOrderInfo, CashOrderTypeIds} from '../../../models/cash-order';
import {I18nContext} from '../../app-component/app-context';
import {ButtonSizes, ButtonVariants, getButtonClassName} from '../../button';
import CashOrderButton from '../../order/cash-order-button';

const {useContext} = React;
const payoutButtonClassName: string = getButtonClassName({
    size: ButtonSizes.SMALL,
    variant: ButtonVariants.ACCENT
});
const PayoutButton: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const orderInfo: CashOrderInfo = {
        orderTypeId: CashOrderTypeIds.WITHDRAWAL,
        bookingSourceId: BankBookingSourceIds.CASH_FUND_COMPENSATION
    };

    return (
        <CashOrderButton orderInfo={orderInfo} className={payoutButtonClassName}>
            {localize(i18n, 'trader.cashFundCompensations.withdraw')}
        </CashOrderButton>
    );
};

export default React.memo(PayoutButton);
