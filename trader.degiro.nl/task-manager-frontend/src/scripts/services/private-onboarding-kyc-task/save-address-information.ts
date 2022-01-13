import {Task} from 'frontend-core/dist/models/task/task';
import {AddressInfo} from 'frontend-core/dist/models/user';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {TaskStatusInformation} from '../../models/private-onboarding-kyc-task';

export default function saveAddressInformation(
    config: Config,
    {taskId}: Task,
    addressInfo: Partial<AddressInfo>
): Promise<TaskStatusInformation> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/address`,
        method: 'PUT',
        body: addressInfo
    });
}
