import { AppError } from '../../models/app-error';
/**
 * @description
 *  Parse different response formats:
 *  --------------
 *  {
 *    statusText: 'error',
 *    message?: string
 *    ...
 * }
 * --------------
 * {
 *    data: {
 *        status: number,
 *        message: string
 *        ...
 *    }
 * }
 * --------------
 * {
 *    status: number
 *    ...
 * }
 * @param {ApiResponse|undefined} response
 * @returns {AppError | any}
 */
export default function parseApiResponse(response) {
    // undefined and null should be in condition
    let apiStatus;
    // https://sentry.io/degiro-bv/degiro-login-frontend/issues/468073278/
    const { data, error, status } = response || { data: undefined, error: undefined, status: undefined };
    const apiStatusText = (response && response.statusText) || (data && data.statusText) || '';
    if (status != null) {
        apiStatus = Number(status);
    }
    else if (data && data.status != null) {
        apiStatus = Number(data.status);
        /**
         * @description `data` object may contain a `status` field.
         * @example [WF-1792]
         *  {
         *      data: {
         *          status: 'SOME_STATUS'
         *      }
         *  }
         */
        if (isNaN(apiStatus)) {
            apiStatus = undefined;
        }
    }
    if ((apiStatus != null && apiStatus !== 0) || apiStatusText === 'error') {
        return new AppError({
            code: String(apiStatusText || apiStatus),
            text: (response && response.message) || (data && data.message) || ''
        });
    }
    if (error) {
        return new AppError(error);
    }
    // unwrap `data` object in response. NOTE: `data` may contain a Boolean or NULL value
    return data === undefined ? response : data;
}
//# sourceMappingURL=parse-api-response.js.map