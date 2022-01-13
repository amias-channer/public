import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isActivityLinkActive({pathname}: Location): boolean {
    return (
        pathname.indexOf(Routes.ORDERS_HISTORY) === 0 ||
        pathname.indexOf(Routes.OPEN_ORDERS) === 0 ||
        pathname.indexOf(Routes.TRANSACTIONS) === 0 ||
        pathname.indexOf(Routes.ACCOUNT_OVERVIEW) === 0 ||
        pathname.indexOf(Routes.REPORTS) === 0 ||
        pathname.indexOf(Routes.PORTFOLIO_DEPRECIATION) === 0
    );
}
