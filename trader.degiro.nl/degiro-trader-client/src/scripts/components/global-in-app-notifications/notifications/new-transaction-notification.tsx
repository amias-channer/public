import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {LatestTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import isOrderBuyAction from 'frontend-core/dist/services/order/is-buy-action';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {Statuses} from '../../../models/status';
import {I18nContext} from '../../app-component/app-context';
import BuySellBadge from '../../buy-sell-badge';
import Snackbar from '../../snackbar';
import {action, gap} from '../../snackbar/snackbar.css';
import StatusIcon from '../../status/status-icon';
import {nbsp} from '../../value';
import Price from '../../value/price';
import {buyBadge, sellBadge} from './notifications.css';

interface Props {
    transaction: LatestTransaction;
    onClose(): void;
}

const {useContext} = React;
const NewTransactionNotification: React.FunctionComponent<Props> = ({onClose, transaction}) => {
    const i18n = useContext(I18nContext);
    const {productInfo} = transaction;

    if (!productInfo) {
        return null;
    }

    const isBuyAction: boolean = isOrderBuyAction(transaction);

    return (
        <Snackbar onClose={onClose}>
            <StatusIcon status={Statuses.SUCCESS} className={inlineLeft} />
            <div>
                {productInfo.name}:{' '}
                <BuySellBadge isBuyAction={isBuyAction} className={isBuyAction ? buyBadge : sellBadge} />{' '}
                {transaction.quantity} {localize(i18n, 'trader.openOrders.executedAmountColumn').toLowerCase()}
                {' @ '}
                <Price
                    id={transaction.id}
                    prefix={`${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                    field="price"
                    value={transaction.price}
                />
            </div>
            <div className={gap} />
            <Link to={Routes.TRANSACTIONS} className={action}>
                {localize(i18n, 'trader.notifications.actions.view')}
            </Link>
        </Snackbar>
    );
};

export default React.memo(NewTransactionNotification);
