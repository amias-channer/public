import {AppError} from 'frontend-core/dist/models/app-error';
import isError from 'frontend-core/dist/utils/is-error';
import {ScannerErrorDetails, SelfieScannerErrorCodes, ErrorDescriptionLabels} from '../../models/fourthline';

export const createScannerResultHandler = <T extends object>(callback: (result: T) => void) => (result: string) => {
    const scannerResult: T = JSON.parse(result);

    return callback(scannerResult);
};

export const createScannerErrorHandler = <T extends number>(
    callback: (error: Error | AppError) => void,
    customErrorDescription?: ErrorDescriptionLabels<T>
) => (error: string | Error) => {
    if (isError(error)) {
        callback(error);
    } else {
        const {errorCode, errorDescription}: ScannerErrorDetails = JSON.parse(error);

        if (errorCode === SelfieScannerErrorCodes.SCANNER_TIMEOUT && customErrorDescription) {
            callback(new AppError({code: errorCode, text: customErrorDescription[errorCode as keyof T]}));
            return;
        }

        callback(new AppError({code: errorCode, text: errorDescription}));
    }
};
