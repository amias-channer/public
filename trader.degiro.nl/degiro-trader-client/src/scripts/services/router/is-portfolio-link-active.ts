import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isPortfolioLinkActive(location: Location): boolean {
    return location.pathname === Routes.PORTFOLIO || location.pathname.indexOf(`${Routes.PORTFOLIO}/`) === 0;
}
