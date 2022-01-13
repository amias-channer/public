import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {TaskStatusInformation, IdMifidNumber} from '../../models/private-onboarding-kyc-task';

export default function saveIdMifidNumber(
    config: Config,
    task: Task,
    data: IdMifidNumber
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${task.taskId}/id-mifid-number`,
        method: 'PUT',
        body: data
    });
}
