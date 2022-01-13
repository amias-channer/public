import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {TaskStatusInformation} from '../../models/private-onboarding-kyc-task';

export default function skipNfc(config: Config, {taskId}: Task): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        method: 'PUT',
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/skip-nfc`
    });
}
