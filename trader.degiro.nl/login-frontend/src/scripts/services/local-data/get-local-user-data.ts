import {UserLocalData} from '../../models/local-data';
import {User} from '../../models/user';

export default function getLocalUserData(user: User): UserLocalData {
    return {
        username: user.username,
        locale: user.locale,
        deviceId: user.deviceId
    };
}
