import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isFavouriteProductsLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.FAVOURITE_PRODUCTS) === 0;
}
