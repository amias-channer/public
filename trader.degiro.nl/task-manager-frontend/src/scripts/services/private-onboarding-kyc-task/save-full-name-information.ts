import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {FullNameInformation, TaskStatusInformation} from '../../models/private-onboarding-kyc-task';

export default function saveFullNameInformation(
    config: Config,
    {taskId}: Task,
    data: Partial<FullNameInformation>
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/full-name`,
        method: 'PUT',
        body: data
    });
}
