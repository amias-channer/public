import {Config} from 'frontend-core/dist/models/config';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {UsSubscriptionSettings} from '../../models/us-subscription';

export default function getUsSubscriptionSettings(config: Config): Promise<UsSubscriptionSettings> {
    return requestToApi({
        config,
        url: `${config.paUrl}settings/us-plan-subscription`
    }).then((response: Pick<UsSubscriptionSettings, 'nextMonthChecked' | 'thisMonthChecked'>) => {
        return {
            ...response,
            isAvailable: response.nextMonthChecked != null && response.thisMonthChecked != null,
            // TODO: move hardcoded values to BE
            productPriceThreshold: {
                amount: 5,
                currency: 'USD'
            },
            price: {
                amount: 2.5,
                currency: 'EUR'
            }
        };
    });
}
