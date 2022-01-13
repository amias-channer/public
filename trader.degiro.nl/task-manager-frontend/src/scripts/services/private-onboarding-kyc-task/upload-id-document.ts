import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {DocumentScannerResult} from '../../models/fourthline';
import {TaskStatusInformation} from '../../models/private-onboarding-kyc-task';
import prepareUploadDocument from './prepare-upload-document';

export default function uploadIdDocument(
    config: Config,
    {taskId}: Task,
    data: DocumentScannerResult
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        method: 'POST',
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/id/upload`,
        body: prepareUploadDocument(config, data)
    });
}
