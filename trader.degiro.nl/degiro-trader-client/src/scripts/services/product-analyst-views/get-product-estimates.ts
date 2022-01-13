import {Config} from 'frontend-core/dist/models/config';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Estimates} from '../../models/analyst-views';
import {RefinitivBaseRequestParams} from '../../models/refinitiv';

export default function getProductEstimates(config: Config, {isin}: RefinitivBaseRequestParams): Promise<Estimates> {
    return requestToApi({
        config,
        url: `${config.refinitivEstimatesUrl}/${isin}`
    });
}
