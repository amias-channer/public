import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {PrivateOnboardingBankAccountInfo} from '../../models/private-onboarding-information-task';

export default function getBankAccountStepData(config: Config, task: Task): Promise<PrivateOnboardingBankAccountInfo> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${task.taskId}/bank-account`
    });
}
