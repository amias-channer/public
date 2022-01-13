import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {IexConnectParams, IexStatuses} from '../../models/iex';
import {User} from '../../models/user';

const apiStatuses: {
    success: IexStatuses;
    error: IexStatuses;
    expired: IexStatuses;
    [key: string]: IexStatuses;
} = {
    success: IexStatuses.SUCCESS,
    error: IexStatuses.FAILURE,
    expired: IexStatuses.EXPIRED
};

export default function connectIex(config: Config, user: User, params: IexConnectParams): Promise<IexStatuses> {
    return requestToApi({
        config: {
            ...config,
            sessionId: user.sessionId
        },
        url: config.iexConnectUrl,
        method: 'POST',
        body: params
    })
        .then(() => apiStatuses.success)
        .catch((error: AppError) => {
            logErrorLocally(error);
            return apiStatuses[error.code] || apiStatuses.error;
        });
}
