import {I18n} from 'frontend-core/dist/models/i18n';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import createRequestErrorHandler from '../request-handler/create-request-error-handler';

interface Params {
    newPassword: string;
    newPasswordConfirmation: string;
    activationCode: string;
    username: string;
}

export default function confirmPasswordReset(config: Config, i18n: I18n, params: Params): Promise<void> {
    return requestToApi({
        config,
        method: 'POST',
        url: config.passwordResetConfirmationUrl,
        body: params
    }).catch(createRequestErrorHandler(i18n));
}
