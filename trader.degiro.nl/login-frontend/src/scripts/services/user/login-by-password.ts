import {I18n} from 'frontend-core/dist/models/i18n';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {PasswordLoginParams, PasswordLoginResponse} from '../../models/user';
import createRequestErrorHandler from '../request-handler/create-request-error-handler';

export default function loginByPassword(
    config: Config,
    i18n: I18n,
    params: PasswordLoginParams
): Promise<PasswordLoginResponse> {
    return requestToApi({
        config,
        method: 'POST',
        url: config.loginByPasswordUrl,
        body: params
    })
        .then((originResponse: PasswordLoginResponse & {status: number; statusText: string}) => {
            /** @todo remove unused keys `status` and `statusText` on BE.
             * BE needs to migrate to a generic response wrapper with `data: {...}`
             */
            const {status, statusText, ...normalizedResponse} = originResponse;

            return normalizedResponse;
        })
        .catch(createRequestErrorHandler(i18n));
}
