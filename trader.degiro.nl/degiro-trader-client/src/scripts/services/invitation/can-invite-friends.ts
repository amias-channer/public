import {User} from 'frontend-core/dist/models/user';

/**
 * @description
 *  - [WF-2576] Only customer from specific countries can invite members to the platform
 * @param {User} client
 * @returns {boolean}
 */
export default function canInviteFriends(client: User): boolean {
    return Boolean(client.canInviteFriends);
}
