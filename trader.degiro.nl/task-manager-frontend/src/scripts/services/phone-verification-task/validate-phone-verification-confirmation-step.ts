import {AppError} from 'frontend-core/dist/models/app-error';
import validateRequiredFields from 'frontend-core/dist/services/form/validate-required-fields';
import {PhoneVerificationConfirmationData} from '../../models/phone-verification-task';

const requiredFields: string[] = ['reference', 'token'];

export default function validatePhoneVerificationConfirmationStep(
    formData: PhoneVerificationConfirmationData
): AppError | undefined {
    return validateRequiredFields(formData, requiredFields);
}
