import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import {RefinitivCompanyProfile} from '../../models/refinitiv-company-profile';
import {RefinitivBaseRequestParams} from '../../models/refinitiv';

export default function getRefinitivCompanyProfile(
    config: Config,
    params: RefinitivBaseRequestParams
): Promise<RefinitivCompanyProfile> {
    return requestToApi({
        config,
        url: `${config.refinitivCompanyProfileUrl}/${params.isin}`
    });
}
