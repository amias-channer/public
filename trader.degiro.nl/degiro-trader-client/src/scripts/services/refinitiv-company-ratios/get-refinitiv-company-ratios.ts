import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import {RefinitivCompanyRatios} from '../../models/refinitiv-company-profile';
import {RefinitivBaseRequestParams} from '../../models/refinitiv';

export default function getRefinitivCompanyRatios(
    config: Config,
    params: RefinitivBaseRequestParams
): Promise<RefinitivCompanyRatios> {
    return requestToApi({
        config,
        url: `${config.refinitivCompanyRatiosUrl}/${params.isin}`
    });
}
