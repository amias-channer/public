import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {PassCodeResetParams, User} from '../../models/user';

export default function setPassCode(config: Config, user: User, params: PassCodeResetParams): Promise<void> {
    return requestToApi({
        config: {
            ...config,
            sessionId: user.sessionId
        },
        method: 'POST',
        url: config.passCodeUrl,
        body: params
    });
}
