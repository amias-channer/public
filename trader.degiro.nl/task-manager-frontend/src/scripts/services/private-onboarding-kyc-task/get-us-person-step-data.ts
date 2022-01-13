import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {UsPersonInformation} from '../../models/private-onboarding-information-task';

export default function getUsPersonStepData(config: Config, {taskId}: Task): Promise<UsPersonInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/us-person`
    });
}
