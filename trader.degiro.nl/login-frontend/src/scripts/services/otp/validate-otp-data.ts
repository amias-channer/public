import {AppError} from 'frontend-core/dist/models/app-error';
import {OtpVerificationData} from '../../models/otp';

const oneTimePasswordPattern: RegExp = /^[0-9]{6}$/;

export default function validateOtpData(data: OtpVerificationData): AppError | undefined {
    if (!oneTimePasswordPattern.test(data.oneTimePassword)) {
        return new AppError({
            field: 'oneTimePassword',
            text: 'twoStepVerification.twoVerificationForm.errors.invalidOneTimePassword'
        });
    }
}
