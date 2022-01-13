import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isOrdersLinkActive({pathname}: Location): boolean {
    return pathname.indexOf(Routes.OPEN_ORDERS) === 0 || pathname.indexOf(Routes.ORDERS_HISTORY) === 0;
}
