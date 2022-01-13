import {AppError} from 'frontend-core/dist/models/app-error';
import validateRequiredFields from 'frontend-core/dist/services/form/validate-required-fields';
import {PhoneInformationStepData} from '../../models/phone-information';

const requiredFields: string[] = ['country', 'phoneNumber', 'confirmationMethod'];

export default function validatePhoneVerificationStartStep(formData: PhoneInformationStepData): AppError | undefined {
    return validateRequiredFields(formData, requiredFields);
}
