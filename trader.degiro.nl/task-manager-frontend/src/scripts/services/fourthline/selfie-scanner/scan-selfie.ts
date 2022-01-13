import {
    SelfieScannerParams,
    SelfieScannerResult,
    OriginSelfieScannerResult,
    ErrorDescriptionLabels,
    SelfieScannerErrorCodes
} from '../../../models/fourthline';
import {createScannerErrorHandler} from '../scanner-handlers';
import createDataUriFromBase64 from '../../data-uri/create-data-uri-from-base64';
import resolveLocalFile from '../../file/resolve-local-file';

export default function scanSelfie(
    params: Partial<SelfieScannerParams>,
    customErrorDescriptionLabels: ErrorDescriptionLabels<SelfieScannerErrorCodes>
): Promise<SelfieScannerResult> {
    return new Promise<SelfieScannerResult>((resolve, reject) => {
        const onSuccess = (result: string) => {
            const originalScannerResult: OriginSelfieScannerResult = JSON.parse(result);
            const promise = resolveLocalFile(originalScannerResult.videoUrl).then((selfieVideo: string) => ({
                metadata: originalScannerResult.metadata,
                selfieImage: createDataUriFromBase64(originalScannerResult.image, 'image/jpg'),
                selfieVideo
            }));

            resolve(promise);
        };
        const onError = createScannerErrorHandler<SelfieScannerErrorCodes>(reject, customErrorDescriptionLabels);

        window.Fourthline!.startSelfie(JSON.stringify(params), onSuccess, onError);
    });
}
