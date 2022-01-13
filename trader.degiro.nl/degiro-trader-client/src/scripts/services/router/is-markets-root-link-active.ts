import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isMarketsRootLinkActive(location: Location): boolean {
    return location.pathname === Routes.MARKETS;
}
