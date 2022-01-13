import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isProductsLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.PRODUCTS) === 0;
}
