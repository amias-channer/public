import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {PlaceOfBirthInformation, TaskStatusInformation} from '../../models/private-onboarding-kyc-task';
import {Config} from '../../models/config';

export default function savePlaceOfBirthInformation(
    config: Config,
    {taskId}: Task,
    placeOfBirthInformation: Partial<PlaceOfBirthInformation>
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/birth-data`,
        method: 'PUT',
        body: placeOfBirthInformation
    });
}
