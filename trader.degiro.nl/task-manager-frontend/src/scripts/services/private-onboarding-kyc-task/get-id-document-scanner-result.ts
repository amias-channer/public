import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {IdUploadDocumentResponse, IdUploadDocumentScannerResult} from '../../models/private-onboarding-kyc-task';
import getDocumentType from './get-document-type';

export default function getIdDocumentScannerResult(
    config: Config,
    {taskId}: Task
): Promise<IdUploadDocumentScannerResult> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/id/upload`
    }).then((idUploadDocument: IdUploadDocumentResponse) => {
        const {documentType, ...mrzInfo} = idUploadDocument;

        return {
            mrzInfo: {
                expirationDate: mrzInfo.dateOfExpiration,
                birthDate: mrzInfo.dateOfBirth,
                firstName: mrzInfo.firstName,
                lastName: mrzInfo.lastName,
                gender: mrzInfo.gender,
                documentNumber: mrzInfo.idNumber
            },
            documentType: getDocumentType(documentType)
        };
    });
}
