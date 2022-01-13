import formatDate from 'frontend-core/dist/utils/date/format-date';
import parseDate from 'frontend-core/dist/utils/date/parse-date';
import {Config} from '../../models/config';
import {DocumentScannerResult, DocumentScansItem, FileSides} from '../../models/fourthline';
import {ScanImageType, UploadDocument, ScanImage} from '../../models/private-onboarding-kyc-task';
import getEligibleDocumentType from './get-eligible-document-type';

const fileSideMap: Record<FileSides, ScanImageType> = {
    [FileSides.BACK]: ScanImageType.BACK,
    [FileSides.FRONT]: ScanImageType.FRONT,
    [FileSides.INSIDE_LEFT]: ScanImageType.INSIDE_LEFT,
    [FileSides.INSIDE_RIGHT]: ScanImageType.INSIDE_RIGHT
};

export default function prepareUploadDocument(
    config: Config,
    documentScannerResult: DocumentScannerResult
): UploadDocument {
    const {defaultApiDateFormat} = config;
    const {documentType, documentVideo, mrzInfo = {}} = documentScannerResult;
    const dateOfBirth: Date | undefined = mrzInfo.birthDate
        ? parseDate(mrzInfo.birthDate, {keepOriginDate: true})
        : undefined;
    const dateOfExpiration: Date | undefined = mrzInfo?.expirationDate
        ? parseDate(mrzInfo.expirationDate, {keepOriginDate: true})
        : undefined;
    const scanRawData: string = JSON.stringify(mrzInfo);
    const scanImages: ScanImage[] = documentScannerResult.documentScans.map((documentScan: DocumentScansItem) => ({
        scanImage: documentScan.image,
        type: fileSideMap[documentScan.metadata.fileSide]
    }));

    return {
        idUploadDocument: {
            nationality: mrzInfo.nationality,
            firstName: mrzInfo.firstName,
            lastName: mrzInfo.lastName,
            documentType: getEligibleDocumentType(documentType),
            idNumber: mrzInfo.documentNumber,
            gender: mrzInfo.gender,
            dateOfBirth: dateOfBirth && formatDate(dateOfBirth, defaultApiDateFormat),
            dateOfExpiration: dateOfExpiration && formatDate(dateOfExpiration, defaultApiDateFormat)
        },
        documentScan: {
            scanImages,
            scanRawData
        },
        documentVideo
    };
}
