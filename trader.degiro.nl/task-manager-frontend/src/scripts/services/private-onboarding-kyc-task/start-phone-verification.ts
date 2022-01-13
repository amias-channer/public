import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {PhoneInformationStepData} from '../../models/phone-information';
import {PhoneVerificationStartResult} from '../../models/phone-verification-task';

export default function startPhoneVerification(
    config: Config,
    task: Task,
    taskData: PhoneInformationStepData
): Promise<PhoneVerificationStartResult> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${task.taskId}/phone/start-verification`,
        method: 'POST',
        body: {
            confirmationMethod: taskData.confirmationMethod,
            phoneNumber: taskData.phoneNumber
        }
    });
}
