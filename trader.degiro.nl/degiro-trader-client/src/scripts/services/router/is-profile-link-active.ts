import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isProfileLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.PROFILE) === 0;
}
