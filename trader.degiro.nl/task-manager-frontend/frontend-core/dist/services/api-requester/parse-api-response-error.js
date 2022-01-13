import { ErrorCodes, AppError } from '../../models/app-error';
/**
 * @description Don't react on auth error for these urls
 * @type {RegExp}
 */
const authErrorUrlIgnorePattern = /vwdservices\.com/;
export default function parseApiResponseError(response, errorDetails) {
    const { status: httpStatus } = response;
    const { message, fieldErrors = {}, globalErrors = [], statusText, code, ...appErrorProps } = errorDetails;
    let errorCode;
    // `ErrorCodes.HTTP_AUTH` leads to a redirect in requestToApi()
    if (httpStatus === 401 && !authErrorUrlIgnorePattern.test(response.url)) {
        errorCode = ErrorCodes.HTTP_AUTH;
    }
    else if (code !== undefined) {
        errorCode = String(code);
    }
    else if (statusText !== undefined) {
        errorCode = String(statusText);
    }
    else if (httpStatus !== undefined) {
        errorCode = String(httpStatus);
        const requestUrl = new URL(response.url);
        const sensitiveSearchParamPairPattern = /(intAccount|sessionId)=/i;
        requestUrl.pathname = requestUrl.pathname.split(/;jsessionid/i)[0];
        requestUrl.search = requestUrl.search
            .split('&')
            .filter((pair) => !sensitiveSearchParamPairPattern.test(pair))
            .join('&');
        // save URL to have more information about failed request,
        // but remove sensitive data to not store it in logs
        appErrorProps.requestUrl = requestUrl.toString();
    }
    appErrorProps.httpStatus = httpStatus;
    appErrorProps.code = errorCode || statusText;
    // In old error response format (fieldErrors, globalErrors) `errors` list is missing,
    // but new response format has it
    appErrorProps.errors = appErrorProps.errors || [];
    appErrorProps.text = appErrorProps.text || message;
    /**
     * if we have the list of errors, we should convert them to the list of `PlainAppError`
     *  errors: {
     *    lastName: 'Invalid field',
     *    country: 'Field is required',
     *    ...
     *  } => {
     *    lastName: PlainAppError;
     *    country: PlainAppError;
     *    ...
     *  }
     */
    Object.keys(fieldErrors).forEach((field) => {
        appErrorProps.errors.push({
            field,
            code: ErrorCodes.VALIDATION,
            text: fieldErrors[field]
        });
    });
    // ['Invalid field', 'Some global error', ...] => [PlainAppError, PlainAppError, ...]
    globalErrors.forEach((text) => {
        appErrorProps.errors.push({
            code: text,
            text
        });
    });
    return new AppError(appErrorProps);
}
//# sourceMappingURL=parse-api-response-error.js.map