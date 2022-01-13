import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {PassCodeLoginParams, PassCodeLoginResponse} from '../../models/user';

export default function loginByPassCode(config: Config, params: PassCodeLoginParams): Promise<PassCodeLoginResponse> {
    return requestToApi({
        config,
        method: 'POST',
        url: config.loginByPassCodeUrl,
        body: params
    }).then((originResponse: PassCodeLoginResponse & {status: number; statusText: string}) => {
        /** @todo remove unused keys `status` and `statusText` on BE.
         * BE needs to migrate to a generic response wrapper with `data: {...}`
         */
        const {status, statusText, ...normalizedResponse} = originResponse;

        return normalizedResponse;
    });
}
