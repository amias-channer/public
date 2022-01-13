import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {
    PhoneVerificationConfirmationData,
    PhoneVerificationConfirmationResult
} from '../../models/phone-verification-task';

export default function completePhoneVerification(
    config: Config,
    task: Task,
    taskData: PhoneVerificationConfirmationData
): Promise<PhoneVerificationConfirmationResult> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${task.taskId}/phone/complete-verification`,
        method: 'POST',
        body: taskData
    });
}
