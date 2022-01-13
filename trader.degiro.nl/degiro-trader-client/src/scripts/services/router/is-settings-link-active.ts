import {Location} from 'history';
import {Routes} from '../../navigation';

export default function isSettingsLinkActive(location: Location): boolean {
    return location.pathname.indexOf(Routes.SETTINGS) === 0;
}
