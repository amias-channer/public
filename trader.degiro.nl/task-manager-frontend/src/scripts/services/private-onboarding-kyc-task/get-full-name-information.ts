import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {FullNameInformation} from '../../models/private-onboarding-kyc-task';
import {Config} from '../../models/config';

export default function getFullNameInformation(config: Config, {taskId}: Task): Promise<FullNameInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/full-name`
    });
}
