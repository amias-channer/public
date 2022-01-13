import * as React from 'react';
import {Link} from 'react-router-dom';
import {Order} from 'frontend-core/dist/models/order';
import {LatestTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import {Routes} from '../../../../navigation';
import {button, buttons} from './payments-navigation.css';
import {paymentsTitle} from '../payments-info.css';
import {I18nContext} from '../../../app-component/app-context';

interface Props {
    orders: Order[];
    transactions: LatestTransaction[];
}

const {useContext, memo} = React;
const PaymentsNavigation = memo<Props>(({orders, transactions}) => {
    const i18n = useContext(I18nContext);

    return (
        <div className={buttons}>
            <Link to={Routes.OPEN_ORDERS} className={button}>
                <span className={paymentsTitle}>
                    {localize(i18n, 'trader.openOrders.title')} ({orders.length})
                </span>
            </Link>
            <Link to={Routes.TRANSACTIONS} className={button}>
                <span className={paymentsTitle}>
                    {localize(i18n, 'trader.transactions.todayTransactions')} ({transactions.length})
                </span>
            </Link>
        </div>
    );
});

PaymentsNavigation.displayName = 'PaymentsNavigation';
export default PaymentsNavigation;
