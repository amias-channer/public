import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {IexReturnUrlGenerationParams, IexReturnUrlParams} from '../../models/iex';
import {User} from '../../models/user';

export default function generateIexReturnUrlParams(
    config: Config,
    user: User,
    params: IexReturnUrlGenerationParams
): Promise<IexReturnUrlParams> {
    return requestToApi({
        config: {
            ...config,
            sessionId: user.sessionId
        },
        url: config.iexReturnUrlParamsGenerationUrl,
        method: 'POST',
        body: params
    });
}
