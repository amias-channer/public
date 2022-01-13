import * as React from 'react';
import {Link} from 'react-router-dom';
import {Order} from 'frontend-core/dist/models/order';
import {LatestTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import {accentWhenSelectedLink} from '../../../../../styles/link.css';
import {Routes} from '../../../../navigation';
import GroupSelect from '../../../group-select';
import {sectionContent, sectionHeader} from './expanded-payments-info.css';
import Orders from './payments-view/orders';
import Transactions from './payments-view/transactions';
import {paymentsTitle} from '../payments-info.css';
import {I18nContext} from '../../../app-component/app-context';

enum PaymentsGroups {
    ORDERS = 'ORDERS',
    TRANSACTIONS = 'TRANSACTIONS'
}

interface Props {
    orders: Order[];
    transactions: LatestTransaction[];
    showProductDetails: boolean;
    compact: boolean;
}

const {useContext, useState} = React;
const ExpandedPaymentsInfo: React.FunctionComponent<Props> = ({orders, transactions, compact, showProductDetails}) => {
    const i18n = useContext(I18nContext);
    const [paymentsGroup, setPaymentsGroup] = useState<PaymentsGroups>(PaymentsGroups.ORDERS);

    if (compact) {
        return (
            <>
                <GroupSelect<PaymentsGroups>
                    selectedOptionId={paymentsGroup}
                    options={[
                        {
                            id: PaymentsGroups.ORDERS,
                            label: (
                                <span className={paymentsTitle}>
                                    {localize(i18n, 'trader.openOrders.title')} ({orders.length})
                                </span>
                            )
                        },
                        {
                            id: PaymentsGroups.TRANSACTIONS,
                            label: (
                                <span className={paymentsTitle}>
                                    {localize(i18n, 'trader.transactions.todayTransactions')} ({transactions.length})
                                </span>
                            )
                        }
                    ]}
                    onChange={setPaymentsGroup}
                />
                {paymentsGroup === PaymentsGroups.ORDERS && (
                    <div className={sectionContent}>
                        <Orders showProductDetails={showProductDetails} orders={orders} />
                    </div>
                )}
                {paymentsGroup === PaymentsGroups.TRANSACTIONS && (
                    <div className={sectionContent}>
                        <Transactions showProductDetails={showProductDetails} transactions={transactions} />
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            <div>
                <Link to={Routes.OPEN_ORDERS} className={`${sectionHeader} ${accentWhenSelectedLink}`}>
                    <span className={paymentsTitle}>
                        {localize(i18n, 'trader.openOrders.title')} ({orders.length})
                    </span>
                </Link>
                <div className={sectionContent}>
                    <Orders showProductDetails={showProductDetails} orders={orders} />
                </div>
            </div>
            <div>
                <Link to={Routes.TRANSACTIONS} className={`${sectionHeader} ${accentWhenSelectedLink}`}>
                    <span className={paymentsTitle}>
                        {localize(i18n, 'trader.transactions.todayTransactions')} ({transactions.length})
                    </span>
                </Link>
                <div className={sectionContent}>
                    <Transactions showProductDetails={showProductDetails} transactions={transactions} />
                </div>
            </div>
        </>
    );
};

export default React.memo(ExpandedPaymentsInfo);
