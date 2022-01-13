import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {ProfessionalCategory} from '../../models/private-onboarding-kyc-task';
import {Industry} from '../../models/industry';

export interface IndustriesRequestParams {
    professionalCategoryId: ProfessionalCategory['id'];
}

export default function getIndustries(config: Config, params: IndustriesRequestParams): Promise<Industry[]> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/flatex-account-opening/industries`,
        params
    });
}
