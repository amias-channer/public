import {Task} from 'frontend-core/dist/models/task/task';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {AddressInfo} from 'frontend-core/dist/models/user';
import {Config} from '../../models/config';

export default function getAddressInformation(config: Config, {taskId}: Task): Promise<AddressInfo> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/${taskId}/address`
    });
}
