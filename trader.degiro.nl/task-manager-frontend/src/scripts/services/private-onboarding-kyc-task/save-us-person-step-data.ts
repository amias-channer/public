import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {TaskStatusInformation, UsPersonStepData} from '../../models/private-onboarding-kyc-task';

export default function saveUsPersonStepData(
    config: Config,
    task: Task,
    data: UsPersonStepData
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${task.taskId}/us-person`,
        method: 'PUT',
        body: data
    });
}
