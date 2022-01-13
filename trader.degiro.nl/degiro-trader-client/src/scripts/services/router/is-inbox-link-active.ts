import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isInboxLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.INBOX) === 0;
}
