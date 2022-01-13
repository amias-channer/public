import {AppError} from 'frontend-core/dist/models/app-error';
import validateRequiredFields from 'frontend-core/dist/services/form/validate-required-fields';
import {
    additionalQuestionsFields,
    PersonInformationUsPersonData
} from '../../models/private-onboarding-information-task';

interface FormData extends PersonInformationUsPersonData {
    [key: string]: boolean | undefined;
}

export default function validateUsPersonInformationStepData(data: FormData): AppError | undefined {
    if (data.isUsPerson === false) {
        return;
    }

    if (typeof data.isUsPerson !== 'boolean') {
        return validateRequiredFields(data, ['isUsPerson']);
    }

    const requiredAdditionalQuestionsFields: string[] = [];

    for (const dataKey of additionalQuestionsFields) {
        if (data[dataKey] === true && !requiredAdditionalQuestionsFields.length) {
            return;
        }
        if (typeof data[dataKey] !== 'boolean') {
            requiredAdditionalQuestionsFields.push(dataKey);
        }
    }

    return validateRequiredFields(data, requiredAdditionalQuestionsFields);
}
