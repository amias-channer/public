import {Location} from 'history';
import isInvitationLinkActive from '../../../../services/router/is-invitation-link-active';
import isProfileLinkActive from '../../../../services/router/is-profile-link-active';

export default function isProfileNavigationItemActive(location: Location): boolean {
    return !isInvitationLinkActive(location) && isProfileLinkActive(location);
}
