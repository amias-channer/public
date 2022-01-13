import {DeviceInfo} from 'frontend-core/dist/platform/get-device-info';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {User} from '../../models/user';

export default function registerDevice(config: Config, user: User, deviceInfo: Partial<DeviceInfo>): Promise<void> {
    return requestToApi({
        config: {
            ...config,
            sessionId: user.sessionId
        },
        method: 'POST',
        url: config.deviceUrl,
        body: {
            deviceId: deviceInfo.uuid,
            deviceInfo: JSON.stringify(deviceInfo)
        }
    });
}
