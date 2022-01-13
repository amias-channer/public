import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {AppParams} from '../../models/app-params';
import {Config} from '../../models/config';
import {OtpVerificationData} from '../../models/otp';
import {User} from '../../models/user';

interface RequestData extends OtpVerificationData {
    username: string | undefined;
    password: string | undefined;
    personId: number | undefined;
    deviceId: string | undefined;
    queryParams: AppParams;
}

export default function checkOtp(config: Config, data: RequestData): Promise<Partial<User>> {
    return requestToApi({
        config,
        method: 'POST',
        url: config.otpCheckUrl,
        body: data
    });
}
