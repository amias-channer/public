import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {PrivateOnboardingKycTaskSteps} from '../../models/private-onboarding-kyc-task';

export default function getTaskPrevStep(config: Config, {taskId}: Task): Promise<PrivateOnboardingKycTaskSteps> {
    return requestToApi({
        config,
        method: 'POST',
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/back`
    });
}
