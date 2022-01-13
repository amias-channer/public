import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {DualNationalityInformation, DualNationalityUpdateResult} from '../../models/private-onboarding-kyc-task';

export default function saveDualNationalityInformation(
    config: Config,
    task: Task,
    data: Partial<DualNationalityInformation>
): Promise<DualNationalityUpdateResult> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${task.taskId}/dual-nationality`,
        method: 'PUT',
        body: data
    });
}
