import * as React from 'react';
import {Order} from 'frontend-core/dist/models/order';
import {LatestTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import {item, list} from './minimized-payments-info.css';
import {paymentsTitle} from '../payments-info.css';
import {I18nContext} from '../../../app-component/app-context';

interface Props {
    orders: Order[];
    transactions: LatestTransaction[];
}
const {useContext, memo} = React;
const MinimizedPaymentsInfo = memo<Props>(({orders, transactions}) => {
    const i18n = useContext(I18nContext);

    return (
        <ul className={list}>
            <li className={item}>
                <span className={paymentsTitle}>
                    {localize(i18n, 'trader.openOrders.title')} ({orders.length})
                </span>
            </li>
            <li className={item}>
                <span className={paymentsTitle}>
                    {localize(i18n, 'trader.transactions.todayTransactions')} ({transactions.length})
                </span>
            </li>
        </ul>
    );
});

MinimizedPaymentsInfo.displayName = 'MinimizedPaymentsInfo';
export default MinimizedPaymentsInfo;
