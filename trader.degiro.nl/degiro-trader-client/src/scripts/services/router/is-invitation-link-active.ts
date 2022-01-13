import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isInvitationLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.INVITE) === 0;
}
