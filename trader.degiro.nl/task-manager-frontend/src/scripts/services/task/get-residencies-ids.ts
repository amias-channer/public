import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';

export default function getResidenciesIds(config: Config): Promise<Array<string>> {
    return requestToApi({
        config,
        url: `${config.paUrl}/clienttasks/countries/allowedResidencies`
    });
}
