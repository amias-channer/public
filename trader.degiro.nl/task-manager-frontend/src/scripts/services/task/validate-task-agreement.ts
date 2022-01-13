import {AppError, ErrorCodes} from 'frontend-core/dist/models/app-error';
import {TaskConfirmationTypes} from '../../models/task';

export default function validateTaskAgreement(
    formData: {[key: string]: any},
    options: {
        confirmationType: TaskConfirmationTypes;
        agreementCheckboxFieldName: string;
    }
): AppError | undefined {
    if (options.confirmationType === TaskConfirmationTypes.AGREEMENT_CHECKBOX) {
        const {agreementCheckboxFieldName} = options;
        const agreementCheckboxValue: boolean = formData[agreementCheckboxFieldName];

        if (!agreementCheckboxValue) {
            return new AppError({
                errors: [
                    {
                        field: agreementCheckboxFieldName,
                        code: ErrorCodes.VALIDATION,
                        text: 'errors.field.required'
                    }
                ]
            });
        }
    }
}
