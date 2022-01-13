import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {EligibleIdDocumentTypes} from '../../models/private-onboarding-kyc-task';

interface RequestParams {
    country: string;
}

export default function getEligibleIdDocumentTypes(
    config: Config,
    params: RequestParams
): Promise<EligibleIdDocumentTypes[]> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/eligible-id-documents`,
        params
    });
}
