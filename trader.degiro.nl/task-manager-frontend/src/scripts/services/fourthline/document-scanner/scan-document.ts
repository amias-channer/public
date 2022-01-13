import {convertCountryCode} from 'frontend-core/dist/services/country/country-code';
import {
    DocumentScannerParams,
    DocumentScannerResult,
    DocumentScansItem,
    OriginDocumentScannerResult
} from '../../../models/fourthline';
import {createScannerErrorHandler} from '../scanner-handlers';
import createDataUriFromBase64 from '../../data-uri/create-data-uri-from-base64';
import resolveLocalFile from '../../file/resolve-local-file';

export default function scanDocument(params: DocumentScannerParams): Promise<DocumentScannerResult> {
    return new Promise<DocumentScannerResult>((resolve, reject) => {
        const onSuccess = (result: string) => {
            const originalScannerResult: OriginDocumentScannerResult = JSON.parse(result);
            const {firstNames, lastNames, nationality, issuingCountry, documentCode, ...scannerResultMrzInfo} =
                originalScannerResult.mrtdMrzInfo || {};
            const nationalityCountryCode = nationality && convertCountryCode(nationality, 'alpha3', 'alpha2');
            const scannerResultPromise = resolveLocalFile(originalScannerResult.videoUrl).then(
                (documentVideo: string) => {
                    const scannerResult: DocumentScannerResult = {
                        documentScans: originalScannerResult.documentScans.map((documentScan: DocumentScansItem) => ({
                            ...documentScan,
                            image: createDataUriFromBase64(documentScan.image, 'image/jpg')
                        })),
                        documentType: params.documentType,
                        documentVideo
                    };

                    if (nationalityCountryCode && firstNames && lastNames) {
                        scannerResult.mrzInfo = {
                            ...scannerResultMrzInfo,
                            firstName: firstNames.join(' '),
                            lastName: lastNames.join(' '),
                            nationality: nationalityCountryCode
                        };
                    }

                    return scannerResult;
                }
            );

            resolve(scannerResultPromise);
        };
        const onError = createScannerErrorHandler(reject);

        window.Fourthline!.startDocument(JSON.stringify(params), onSuccess, onError);
    });
}
