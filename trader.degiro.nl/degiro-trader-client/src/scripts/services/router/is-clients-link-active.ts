import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isClientsLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.CLIENTS) === 0;
}
