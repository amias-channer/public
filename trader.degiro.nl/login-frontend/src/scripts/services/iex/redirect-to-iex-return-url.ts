import {logWarningLocally} from 'frontend-core/dist/loggers/local-logger';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import {IexParams, IexReturnUrlParams, IexStatuses} from '../../models/iex';

export default function redirectToIexReturnUrl(
    iexStatus: IexStatuses,
    iexParams: IexParams,
    iexReturnUrlParams: IexReturnUrlParams
) {
    const {iexReturnUrl} = iexParams;

    if (!iexReturnUrl) {
        return logWarningLocally('iexReturnUrl is missing', iexParams);
    }

    self.location.replace(
        `${iexReturnUrl}?${getQueryString({
            ...iexReturnUrlParams,
            iexStatus,
            iexId: iexParams.iexId,
            iexAction: iexParams.iexAction
        })}`
    );
}
