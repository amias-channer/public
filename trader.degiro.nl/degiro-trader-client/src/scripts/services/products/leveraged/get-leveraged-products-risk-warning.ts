import {Config} from 'frontend-core/dist/models/config';
import {LeveragedProductsRiskWarning} from 'frontend-core/dist/models/leveraged';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';

export default function getLeveragedProductsRiskWarning(config: Config): Promise<LeveragedProductsRiskWarning> {
    return requestToApi({
        config,
        url: `${config.productSearchUrl}v5/leverageds/warning`
    });
}
