import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {ProfessionInformation, TaskStatusInformation} from '../../models/private-onboarding-kyc-task';

export default function saveProfessionInformationStepData(
    config: Config,
    {taskId}: Task,
    professionInformation: Partial<ProfessionInformation>
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/profession`,
        method: 'PUT',
        body: professionInformation
    });
}
