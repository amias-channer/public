import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {PhoneCountryCodes} from '../../models/phone-verification-task';
import {Config} from '../../models/config';

export default function getPhoneCountryCodes(config: Config): Promise<PhoneCountryCodes> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/private-onboarding-kyc/information/phone/country-codes`
    });
}
