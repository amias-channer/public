import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {MetadataInformation, TaskStatusInformation} from '../../models/private-onboarding-kyc-task';

export default function saveMetadataInformation(
    config: Config,
    {taskId}: Task,
    data: MetadataInformation
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        method: 'POST',
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/metadata`,
        body: data
    });
}
