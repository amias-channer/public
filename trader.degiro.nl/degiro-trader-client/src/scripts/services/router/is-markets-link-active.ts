import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isMarketsLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.MARKETS) === 0;
}
