import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {ProfessionalCategory} from '../../models/private-onboarding-kyc-task';

export default function getProfessionalCategories(config: Config): Promise<ProfessionalCategory[]> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/flatex-account-opening/professional-categories`
    });
}
