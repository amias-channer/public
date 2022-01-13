import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {SelfieScannerResult} from '../../models/fourthline';
import {TaskStatusInformation} from '../../models/private-onboarding-kyc-task';

export default function uploadSelfie(
    config: Config,
    {taskId}: Task,
    data: SelfieScannerResult
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        method: 'POST',
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/selfie`,
        body: {
            selfieImage: data.selfieImage,
            selfieVideo: data.selfieVideo
        }
    });
}
